import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { ExpensesService } from './expenses.service.js';
import {
    Expense,
    ExpenseSplit,
    UserRole,
    type User,
} from '../entities/index.js';

const mockExpenseRepo = () => ({
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
});

const mockSplitRepo = () => ({
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
});

describe('ExpensesService', () => {
    let service: ExpensesService;
    let expenseRepo: ReturnType<typeof mockExpenseRepo>;
    let splitRepo: ReturnType<typeof mockSplitRepo>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ExpensesService,
                {
                    provide: getRepositoryToken(Expense),
                    useFactory: mockExpenseRepo,
                },
                {
                    provide: getRepositoryToken(ExpenseSplit),
                    useFactory: mockSplitRepo,
                },
            ],
        }).compile();

        service = module.get<ExpensesService>(ExpensesService);
        expenseRepo = module.get(getRepositoryToken(Expense));
        splitRepo = module.get(getRepositoryToken(ExpenseSplit));
    });

    describe('create', () => {
        it('should create an expense with valid splits', async () => {
            const expense = { id: 'exp-1', spaceId: 's1', amount: 100 };
            expenseRepo.create.mockReturnValue(expense);
            expenseRepo.save.mockResolvedValue(expense);
            expenseRepo.findOne.mockResolvedValue({
                ...expense,
                splits: [],
                paidBy: { name: 'Alice' },
            });
            splitRepo.create.mockImplementation((data) => data);
            splitRepo.save.mockResolvedValue([]);

            const result = await service.create(
                's1',
                'user-1',
                100,
                'Dinner',
                'food',
                '2024-01-01',
                [
                    { userId: 'user-1', percentage: 50 },
                    { userId: 'user-2', percentage: 50 },
                ],
            );

            expect(expenseRepo.save).toHaveBeenCalled();
            expect(splitRepo.save).toHaveBeenCalled();
            expect(result).toBeDefined();
        });

        it('should reject splits that do not sum to 100%', async () => {
            await expect(
                service.create(
                    's1',
                    'user-1',
                    100,
                    'Dinner',
                    'food',
                    '2024-01-01',
                    [
                        { userId: 'user-1', percentage: 30 },
                        { userId: 'user-2', percentage: 30 },
                    ],
                ),
            ).rejects.toThrow(BadRequestException);
        });

        it('should reject empty splits', async () => {
            await expect(
                service.create(
                    's1',
                    'user-1',
                    100,
                    'Dinner',
                    'food',
                    '2024-01-01',
                    [],
                ),
            ).rejects.toThrow(BadRequestException);
        });
    });

    describe('update', () => {
        const adminUser: User = {
            id: 'admin-1',
            role: UserRole.ADMIN,
        } as User;

        const memberUser: User = {
            id: 'user-2',
            role: UserRole.MEMBER,
        } as User;

        it('should allow the payer to update their expense', async () => {
            const expense = {
                id: 'exp-1',
                paidById: 'user-2',
                amount: 100,
                splits: [],
                paidBy: { name: 'Bob' },
            };
            expenseRepo.findOne.mockResolvedValue(expense);
            expenseRepo.save.mockResolvedValue(expense);

            await service.update('exp-1', memberUser, {
                description: 'Updated',
            });

            expect(expenseRepo.save).toHaveBeenCalled();
        });

        it('should allow admin to update any expense', async () => {
            const expense = {
                id: 'exp-1',
                paidById: 'other-user',
                amount: 100,
                splits: [],
                paidBy: { name: 'Someone' },
            };
            expenseRepo.findOne.mockResolvedValue(expense);
            expenseRepo.save.mockResolvedValue(expense);

            await service.update('exp-1', adminUser, {
                description: 'Admin edit',
            });

            expect(expenseRepo.save).toHaveBeenCalled();
        });

        it('should deny non-payer non-admin from updating', async () => {
            const expense = {
                id: 'exp-1',
                paidById: 'someone-else',
                amount: 100,
                splits: [],
                paidBy: { name: 'Someone' },
            };
            expenseRepo.findOne.mockResolvedValue(expense);

            await expect(
                service.update('exp-1', memberUser, { description: 'Nope' }),
            ).rejects.toThrow(ForbiddenException);
        });
    });

    describe('delete', () => {
        it('should deny non-payer non-admin from deleting', async () => {
            const expense = {
                id: 'exp-1',
                paidById: 'someone-else',
                amount: 50,
                splits: [],
                paidBy: { name: 'Someone' },
            };
            expenseRepo.findOne.mockResolvedValue(expense);

            const memberUser: User = {
                id: 'user-2',
                role: UserRole.MEMBER,
            } as User;

            await expect(service.delete('exp-1', memberUser)).rejects.toThrow(
                ForbiddenException,
            );
        });
    });
});
