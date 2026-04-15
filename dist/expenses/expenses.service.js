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
exports.ExpensesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const index_js_1 = require("../entities/index.js");
let ExpensesService = class ExpensesService {
    expenseRepo;
    splitRepo;
    constructor(expenseRepo, splitRepo) {
        this.expenseRepo = expenseRepo;
        this.splitRepo = splitRepo;
    }
    async create(spaceId, paidById, amount, description, category, date, splits) {
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
        const splitEntities = splits.map((s) => this.splitRepo.create({
            expenseId: expense.id,
            userId: s.userId,
            percentage: s.percentage,
            amount: (amount * s.percentage) / 100,
        }));
        await this.splitRepo.save(splitEntities);
        return this.findOne(expense.id);
    }
    async findAllBySpace(spaceId) {
        return this.expenseRepo.find({
            where: { spaceId },
            relations: ['splits', 'splits.user', 'paidBy'],
            order: { date: 'DESC', createdAt: 'DESC' },
        });
    }
    async findOne(expenseId) {
        const expense = await this.expenseRepo.findOne({
            where: { id: expenseId },
            relations: ['splits', 'splits.user', 'paidBy'],
        });
        if (!expense)
            throw new common_1.NotFoundException('Expense not found');
        return expense;
    }
    async update(expenseId, requestingUser, updates) {
        const expense = await this.findOne(expenseId);
        if (expense.paidById !== requestingUser.id &&
            requestingUser.role !== index_js_1.UserRole.ADMIN) {
            throw new common_1.ForbiddenException('Only the payer or an admin can edit this expense');
        }
        if (updates.amount !== undefined)
            expense.amount = updates.amount;
        if (updates.description !== undefined)
            expense.description = updates.description;
        if (updates.category !== undefined)
            expense.category = updates.category;
        if (updates.date !== undefined)
            expense.date = updates.date;
        await this.expenseRepo.save(expense);
        if (updates.splits) {
            const amount = updates.amount ?? expense.amount;
            this.validateSplits(updates.splits, amount);
            await this.splitRepo.delete({ expenseId });
            const splitEntities = updates.splits.map((s) => this.splitRepo.create({
                expenseId,
                userId: s.userId,
                percentage: s.percentage,
                amount: (amount * s.percentage) / 100,
            }));
            await this.splitRepo.save(splitEntities);
        }
        return this.findOne(expenseId);
    }
    async delete(expenseId, requestingUser) {
        const expense = await this.findOne(expenseId);
        if (expense.paidById !== requestingUser.id &&
            requestingUser.role !== index_js_1.UserRole.ADMIN) {
            throw new common_1.ForbiddenException('Only the payer or an admin can delete this expense');
        }
        await this.expenseRepo.remove(expense);
    }
    validateSplits(splits, amount) {
        if (splits.length === 0) {
            throw new common_1.BadRequestException('At least one split is required');
        }
        const totalPercentage = splits.reduce((sum, s) => sum + s.percentage, 0);
        if (Math.abs(totalPercentage - 100) > 0.01) {
            throw new common_1.BadRequestException(`Split percentages must sum to 100, got ${totalPercentage}`);
        }
        void amount;
    }
};
exports.ExpensesService = ExpensesService;
exports.ExpensesService = ExpensesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(index_js_1.Expense)),
    __param(1, (0, typeorm_1.InjectRepository)(index_js_1.ExpenseSplit)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ExpensesService);
//# sourceMappingURL=expenses.service.js.map