import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
    Settlement,
    Expense,
    ExpenseSplit,
    SpaceParticipant,
} from '../entities/index';

export interface DebtEdge {
    from: string;
    fromName: string;
    to: string;
    toName: string;
    amount: number;
}

export interface BalanceSummary {
    userId: string;
    userName: string;
    balance: number; // positive = owed money, negative = owes money
}

@Injectable()
export class SettlementsService {
    constructor(
        @InjectRepository(Settlement)
        private settlementRepo: Repository<Settlement>,
        @InjectRepository(Expense)
        private expenseRepo: Repository<Expense>,
        @InjectRepository(ExpenseSplit)
        private splitRepo: Repository<ExpenseSplit>,
        @InjectRepository(SpaceParticipant)
        private participantRepo: Repository<SpaceParticipant>,
    ) {}

    async createSettlement(
        spaceId: string,
        fromUserId: string,
        toUserId: string,
        amount: number,
    ): Promise<Settlement> {
        const settlement = this.settlementRepo.create({
            spaceId,
            fromUserId,
            toUserId,
            amount,
        });
        return this.settlementRepo.save(settlement);
    }

    async getSettlements(spaceId: string): Promise<Settlement[]> {
        return this.settlementRepo.find({
            where: { spaceId },
            relations: ['fromUser', 'toUser'],
            order: { createdAt: 'DESC' },
        });
    }

    async getBalances(spaceId: string): Promise<BalanceSummary[]> {
        const participants = await this.participantRepo.find({
            where: { spaceId },
            relations: ['user'],
        });

        const balanceMap = new Map<string, { name: string; balance: number }>();

        for (const p of participants) {
            balanceMap.set(p.userId, { name: p.user.name, balance: 0 });
        }

        // Add what each person paid
        const expenses = await this.expenseRepo.find({
            where: { spaceId },
            relations: ['splits'],
        });

        for (const expense of expenses) {
            const payer = balanceMap.get(expense.paidById);
            if (payer) payer.balance += expense.amount;

            for (const split of expense.splits) {
                const debtor = balanceMap.get(split.userId);
                if (debtor) debtor.balance -= split.amount;
            }
        }

        // Account for settlements already made
        const settlements = await this.settlementRepo.find({
            where: { spaceId },
        });

        for (const s of settlements) {
            const from = balanceMap.get(s.fromUserId);
            const to = balanceMap.get(s.toUserId);
            if (from) from.balance += s.amount; // payer's debt reduced
            if (to) to.balance -= s.amount; // receiver got less owed
        }

        return Array.from(balanceMap.entries()).map(([userId, data]) => ({
            userId,
            userName: data.name,
            balance: Math.round(data.balance * 100) / 100,
        }));
    }

    async getSimplifiedDebts(spaceId: string): Promise<DebtEdge[]> {
        const balances = await this.getBalances(spaceId);
        return this.simplifyDebts(balances);
    }

    /**
     * Debt simplification: minimize the number of transfers.
     * Greedy algorithm: repeatedly match the largest creditor with the largest debtor.
     */
    simplifyDebts(balances: BalanceSummary[]): DebtEdge[] {
        const debtors: { userId: string; userName: string; amount: number }[] =
            [];
        const creditors: {
            userId: string;
            userName: string;
            amount: number;
        }[] = [];

        for (const b of balances) {
            if (b.balance < -0.01) {
                debtors.push({
                    userId: b.userId,
                    userName: b.userName,
                    amount: -b.balance,
                });
            } else if (b.balance > 0.01) {
                creditors.push({
                    userId: b.userId,
                    userName: b.userName,
                    amount: b.balance,
                });
            }
        }

        const edges: DebtEdge[] = [];

        // Sort descending
        debtors.sort((a, b) => b.amount - a.amount);
        creditors.sort((a, b) => b.amount - a.amount);

        let i = 0;
        let j = 0;

        while (i < debtors.length && j < creditors.length) {
            const transfer = Math.min(debtors[i].amount, creditors[j].amount);

            if (transfer > 0.01) {
                edges.push({
                    from: debtors[i].userId,
                    fromName: debtors[i].userName,
                    to: creditors[j].userId,
                    toName: creditors[j].userName,
                    amount: Math.round(transfer * 100) / 100,
                });
            }

            debtors[i].amount -= transfer;
            creditors[j].amount -= transfer;

            if (debtors[i].amount < 0.01) i++;
            if (creditors[j].amount < 0.01) j++;
        }

        return edges;
    }

    async deleteSettlement(settlementId: string): Promise<void> {
        const settlement = await this.settlementRepo.findOneBy({
            id: settlementId,
        });
        if (!settlement) throw new NotFoundException('Settlement not found');
        await this.settlementRepo.remove(settlement);
    }
}
