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
exports.ExpensesController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const expenses_service_js_1 = require("./expenses.service.js");
const create_expense_dto_js_1 = require("./dto/create-expense.dto.js");
const update_expense_dto_js_1 = require("./dto/update-expense.dto.js");
const current_user_decorator_js_1 = require("../common/decorators/current-user.decorator.js");
const space_member_guard_js_1 = require("../common/guards/space-member.guard.js");
const index_js_1 = require("../entities/index.js");
let ExpensesController = class ExpensesController {
    expensesService;
    constructor(expensesService) {
        this.expensesService = expensesService;
    }
    create(spaceId, dto, user) {
        return this.expensesService.create(spaceId, user.id, dto.amount, dto.description, dto.category, dto.date, dto.splits);
    }
    findAll(spaceId) {
        return this.expensesService.findAllBySpace(spaceId);
    }
    findOne(expenseId) {
        return this.expensesService.findOne(expenseId);
    }
    update(expenseId, dto, user) {
        return this.expensesService.update(expenseId, user, dto);
    }
    delete(expenseId, user) {
        return this.expensesService.delete(expenseId, user);
    }
};
exports.ExpensesController = ExpensesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Param)('spaceId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_js_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_expense_dto_js_1.CreateExpenseDto,
        index_js_1.User]),
    __metadata("design:returntype", void 0)
], ExpensesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('spaceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ExpensesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':expenseId'),
    __param(0, (0, common_1.Param)('expenseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ExpensesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':expenseId'),
    __param(0, (0, common_1.Param)('expenseId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_js_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_expense_dto_js_1.UpdateExpenseDto,
        index_js_1.User]),
    __metadata("design:returntype", void 0)
], ExpensesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':expenseId'),
    __param(0, (0, common_1.Param)('expenseId')),
    __param(1, (0, current_user_decorator_js_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, index_js_1.User]),
    __metadata("design:returntype", void 0)
], ExpensesController.prototype, "delete", null);
exports.ExpensesController = ExpensesController = __decorate([
    (0, common_1.Controller)('spaces/:spaceId/expenses'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), space_member_guard_js_1.SpaceMemberGuard),
    __metadata("design:paramtypes", [expenses_service_js_1.ExpensesService])
], ExpensesController);
//# sourceMappingURL=expenses.controller.js.map