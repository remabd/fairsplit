"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettlementsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const index_js_1 = require("../entities/index.js");
let SettlementsService = class SettlementsService {
    settlementRepo;
    expenseRepo;
    splitRepo;
    participantRepo;
    constructor(settlementRepo, expenseRepo, splitRepo, participantRepo) {
        this.settlementRepo = settlementRepo;
        this.expenseRepo = expenseRepo;
        this.splitRepo = splitRepo;
        this.participantRepo = participantRepo;
    }
    async createSettlement(spaceId, fromUserId, toUserId, amount) {
        const settlement = this.settlementRepo.create({
            spaceId,
            fromUserId,
            toUserId,
            amount,
        });
        return this.settlementRepo.save(settlement);
    }
    async getSettlements(spaceId) {
        return this.settlementRepo.find({
            where: { spaceId },
            relations: ['fromUser', 'toUser'],
            order: { createdAt: 'DESC' },
        });
    }
    async getBalances(spaceId) {
        const participants = await this.participantRepo.find({
            where: { spaceId },
            relations: ['user'],
        });
        const balanceMap = new Map();
        for (const p of participants) {
            balanceMap.set(p.userId, { name: p.user.name, balance: 0 });
        }
        const expenses = await this.expenseRepo.find({
            where: { spaceId },
            relations: ['splits'],
        });
        for (const expense of expenses) {
            const payer = balanceMap.get(expense.paidById);
            if (payer)
                payer.balance += expense.amount;
            for (const split of expense.splits) {
                const debtor = balanceMap.get(split.userId);
                if (debtor)
                    debtor.balance -= split.amount;
            }
        }
        const settlements = await this.settlementRepo.find({
            where: { spaceId },
        });
        for (const s of settlements) {
            const from = balanceMap.get(s.fromUserId);
            const to = balanceMap.get(s.toUserId);
            if (from)
                from.balance += s.amount;
            if (to)
                to.balance -= s.amount;
        }
        return Array.from(balanceMap.entries()).map(([userId, data]) => ({
            userId,
            userName: data.name,
            balance: Math.round(data.balance * 100) / 100,
        }));
    }
    async getSimplifiedDebts(spaceId) {
        const balances = await this.getBalances(spaceId);
        return this.simplifyDebts(balances);
    }
    simplifyDebts(balances) {
        const debtors = [];
        const creditors = [];
        for (const b of balances) {
            if (b.balance < -0.01) {
                debtors.push({
                    userId: b.userId,
                    userName: b.userName,
                    amount: -b.balance,
                });
            }
            else if (b.balance > 0.01) {
                creditors.push({
                    userId: b.userId,
                    userName: b.userName,
                    amount: b.balance,
                });
            }
        }
        const edges = [];
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
            if (debtors[i].amount < 0.01)
                i++;
            if (creditors[j].amount < 0.01)
                j++;
        }
        return edges;
    }
    async deleteSettlement(settlementId) {
        const settlement = await this.settlementRepo.findOneBy({
            id: settlementId,
        });
        if (!settlement)
            throw new common_1.NotFoundException('Settlement not found');
        await this.settlementRepo.remove(settlement);
    }
};
exports.SettlementsService = SettlementsService;
exports.SettlementsService = SettlementsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(index_js_1.Settlement)),
    __param(1, (0, typeorm_1.InjectRepository)(index_js_1.Expense)),
    __param(2, (0, typeorm_1.InjectRepository)(index_js_1.ExpenseSplit)),
    __param(3, (0, typeorm_1.InjectRepository)(index_js_1.SpaceParticipant)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], SettlementsService);
//# sourceMappingURL=settlements.service.js.map