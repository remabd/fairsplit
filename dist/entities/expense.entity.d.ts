import { Space } from './space.entity.js';
import { User } from './user.entity.js';
import { ExpenseSplit } from './expense-split.entity.js';
export declare class Expense {
    id: string;
    space: Space;
    spaceId: string;
    paidBy: User;
    paidById: string;
    amount: number;
    description: string;
    category: string;
    date: string;
    createdAt: Date;
    updatedAt: Date;
    splits: ExpenseSplit[];
}
