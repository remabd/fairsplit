import { Expense } from './expense.entity.js';
import { User } from './user.entity.js';
export declare class ExpenseSplit {
    id: string;
    expense: Expense;
    expenseId: string;
    user: User;
    userId: string;
    percentage: number;
    amount: number;
}
