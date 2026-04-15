import { ExpensesService } from './expenses.service.js';
import { CreateExpenseDto } from './dto/create-expense.dto.js';
import { UpdateExpenseDto } from './dto/update-expense.dto.js';
import { User } from '../entities/index.js';
export declare class ExpensesController {
    private expensesService;
    constructor(expensesService: ExpensesService);
    create(spaceId: string, dto: CreateExpenseDto, user: User): Promise<import("../entities/expense.entity.js").Expense>;
    findAll(spaceId: string): Promise<import("../entities/expense.entity.js").Expense[]>;
    findOne(expenseId: string): Promise<import("../entities/expense.entity.js").Expense>;
    update(expenseId: string, dto: UpdateExpenseDto, user: User): Promise<import("../entities/expense.entity.js").Expense>;
    delete(expenseId: string, user: User): Promise<void>;
}
