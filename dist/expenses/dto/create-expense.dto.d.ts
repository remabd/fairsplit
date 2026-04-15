export declare class ExpenseSplitDto {
    userId: string;
    percentage: number;
}
export declare class CreateExpenseDto {
    spaceId: string;
    amount: number;
    description: string;
    category?: string;
    date: string;
    splits: ExpenseSplitDto[];
}
