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
exports.SettlementsController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const settlements_service_js_1 = require("./settlements.service.js");
const create_settlement_dto_js_1 = require("./dto/create-settlement.dto.js");
const current_user_decorator_js_1 = require("../common/decorators/current-user.decorator.js");
const space_member_guard_js_1 = require("../common/guards/space-member.guard.js");
const index_js_1 = require("../entities/index.js");
let SettlementsController = class SettlementsController {
    settlementsService;
    constructor(settlementsService) {
        this.settlementsService = settlementsService;
    }
    create(spaceId, dto, user) {
        return this.settlementsService.createSettlement(spaceId, user.id, dto.toUserId, dto.amount);
    }
    findAll(spaceId) {
        return this.settlementsService.getSettlements(spaceId);
    }
    getBalances(spaceId) {
        return this.settlementsService.getBalances(spaceId);
    }
    getSimplifiedDebts(spaceId) {
        return this.settlementsService.getSimplifiedDebts(spaceId);
    }
    delete(settlementId) {
        return this.settlementsService.deleteSettlement(settlementId);
    }
};
exports.SettlementsController = SettlementsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Param)('spaceId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_js_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_settlement_dto_js_1.CreateSettlementDto,
        index_js_1.User]),
    __metadata("design:returntype", void 0)
], SettlementsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('spaceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SettlementsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('balances'),
    __param(0, (0, common_1.Param)('spaceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SettlementsController.prototype, "getBalances", null);
__decorate([
    (0, common_1.Get)('debts'),
    __param(0, (0, common_1.Param)('spaceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SettlementsController.prototype, "getSimplifiedDebts", null);
__decorate([
    (0, common_1.Delete)(':settlementId'),
    __param(0, (0, common_1.Param)('settlementId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SettlementsController.prototype, "delete", null);
exports.SettlementsController = SettlementsController = __decorate([
    (0, common_1.Controller)('spaces/:spaceId/settlements'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), space_member_guard_js_1.SpaceMemberGuard),
    __metadata("design:paramtypes", [settlements_service_js_1.SettlementsService])
], SettlementsController);
//# sourceMappingURL=settlements.controller.js.map