import { ExpenseSplitDto } from './create-expense.dto.js';
export declare class UpdateExpenseDto {
    amount?: number;
    description?: string;
    category?: string;
    date?: string;
    splits?: ExpenseSplitDto[];
}
