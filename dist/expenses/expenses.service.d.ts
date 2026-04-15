import { Repository } from 'typeorm';
import { Expense, ExpenseSplit, User } from '../entities/index.js';
import { type ExpenseSplitDto } from './dto/create-expense.dto.js';
export declare class ExpensesService {
    private expenseRepo;
    private splitRepo;
    constructor(expenseRepo: Repository<Expense>, splitRepo: Repository<ExpenseSplit>);
    create(spaceId: string, paidById: string, amount: number, description: string, category: string | undefined, date: string, splits: ExpenseSplitDto[]): Promise<Expense>;
    findAllBySpace(spaceId: string): Promise<Expense[]>;
    findOne(expenseId: string): Promise<Expense>;
    update(expenseId: string, requestingUser: User, updates: {
        amount?: number;
        description?: string;
        category?: string;
        date?: string;
        splits?: ExpenseSplitDto[];
    }): Promise<Expense>;
    delete(expenseId: string, requestingUser: User): Promise<void>;
    private validateSplits;
}
