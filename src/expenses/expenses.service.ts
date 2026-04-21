import {
    Injectable,
    NotFoundException,
    ForbiddenException,
    BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense, ExpenseSplit, User, UserRole } from '../entities/index';
import { type ExpenseSplitDto } from './dto/create-expense.dto';

@Injectable()
export class ExpensesService {
    constructor(
        @InjectRepository(Expense)
        private expenseRepo: Repository<Expense>,
        @InjectRepository(ExpenseSplit)
        private splitRepo: Repository<ExpenseSplit>,
    ) {}

    async create(
        spaceId: string,
        paidById: string,
        amount: number,
        description: string,
        category: string | undefined,
        date: string,
        splits: ExpenseSplitDto[],
    ): Promise<Expense> {
        this.validateSplits(splits, amount);

        const expense = this.expenseRepo.create({
            spaceId,
            paidById,
            amount,
            description,
            category,
            date,
        });
        await this.expenseRepo.save(expense);

        const splitEntities = splits.map((s) =>
            this.splitRepo.create({
                expenseId: expense.id,
                userId: s.userId,
                percentage: s.percentage,
                amount: (amount * s.percentage) / 100,
            }),
        );
        await this.splitRepo.save(splitEntities);

        return this.findOne(expense.id);
    }

    async findAllBySpace(spaceId: string): Promise<Expense[]> {
        return this.expenseRepo.find({
            where: { spaceId },
            relations: ['splits', 'splits.user', 'paidBy'],
            order: { date: 'DESC', createdAt: 'DESC' },
        });
    }

    async findOne(expenseId: string): Promise<Expense> {
        const expense = await this.expenseRepo.findOne({
            where: { id: expenseId },
            relations: ['splits', 'splits.user', 'paidBy'],
        });
        if (!expense) throw new NotFoundException('Expense not found');
        return expense;
    }

    async update(
        expenseId: string,
        requestingUser: User,
        updates: {
            amount?: number;
            description?: string;
            category?: string;
            date?: string;
            splits?: ExpenseSplitDto[];
        },
    ): Promise<Expense> {
        const expense = await this.findOne(expenseId);

        if (
            expense.paidById !== requestingUser.id &&
            requestingUser.role !== UserRole.ADMIN
        ) {
            throw new ForbiddenException(
                'Only the payer or an admin can edit this expense',
            );
        }

        if (updates.amount !== undefined) expense.amount = updates.amount;
        if (updates.description !== undefined)
            expense.description = updates.description;
        if (updates.category !== undefined) expense.category = updates.category;
        if (updates.date !== undefined) expense.date = updates.date;

        await this.expenseRepo.save(expense);

        if (updates.splits) {
            const amount = updates.amount ?? expense.amount;
            this.validateSplits(updates.splits, amount);

            await this.splitRepo.delete({ expenseId });

            const splitEntities = updates.splits.map((s) =>
                this.splitRepo.create({
                    expenseId,
                    userId: s.userId,
                    percentage: s.percentage,
                    amount: (amount * s.percentage) / 100,
                }),
            );
            await this.splitRepo.save(splitEntities);
        }

        return this.findOne(expenseId);
    }

    async delete(expenseId: string, requestingUser: User): Promise<void> {
        const expense = await this.findOne(expenseId);

        if (
            expense.paidById !== requestingUser.id &&
            requestingUser.role !== UserRole.ADMIN
        ) {
            throw new ForbiddenException(
                'Only the payer or an admin can delete this expense',
            );
        }

        await this.expenseRepo.remove(expense);
    }

    private validateSplits(splits: ExpenseSplitDto[], amount: number): void {
        if (splits.length === 0) {
            throw new BadRequestException('At least one split is required');
        }

        const totalPercentage = splits.reduce(
            (sum, s) => sum + s.percentage,
            0,
        );
        if (Math.abs(totalPercentage - 100) > 0.01) {
            throw new BadRequestException(
                `Split percentages must sum to 100, got ${totalPercentage}`,
            );
        }

        // Suppress unused variable — amount is validated by caller
        void amount;
    }
}
