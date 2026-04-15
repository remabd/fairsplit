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
exports.SpacesController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const spaces_service_js_1 = require("./spaces.service.js");
const create_space_dto_js_1 = require("./dto/create-space.dto.js");
const add_participant_dto_js_1 = require("./dto/add-participant.dto.js");
const current_user_decorator_js_1 = require("../common/decorators/current-user.decorator.js");
const roles_guard_js_1 = require("../common/guards/roles.guard.js");
const space_member_guard_js_1 = require("../common/guards/space-member.guard.js");
const index_js_1 = require("../entities/index.js");
let SpacesController = class SpacesController {
    spacesService;
    constructor(spacesService) {
        this.spacesService = spacesService;
    }
    create(dto, user) {
        return this.spacesService.create(dto.name, dto.currency ?? 'EUR', user.id);
    }
    findAll(user) {
        return this.spacesService.findAllForUser(user.id);
    }
    findOne(spaceId) {
        return this.spacesService.findOne(spaceId);
    }
    addParticipant(spaceId, dto) {
        return this.spacesService.addParticipant(spaceId, dto.userId);
    }
    removeParticipant(spaceId, userId, user) {
        return this.spacesService.removeParticipant(spaceId, userId, user);
    }
};
exports.SpacesController = SpacesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(roles_guard_js_1.RolesGuard),
    (0, roles_guard_js_1.Roles)(index_js_1.UserRole.ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_js_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_space_dto_js_1.CreateSpaceDto, index_js_1.User]),
    __metadata("design:returntype", void 0)
], SpacesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_js_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [index_js_1.User]),
    __metadata("design:returntype", void 0)
], SpacesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':spaceId'),
    (0, common_1.UseGuards)(space_member_guard_js_1.SpaceMemberGuard),
    __param(0, (0, common_1.Param)('spaceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SpacesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(':spaceId/participants'),
    (0, common_1.UseGuards)(space_member_guard_js_1.SpaceMemberGuard),
    __param(0, (0, common_1.Param)('spaceId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, add_participant_dto_js_1.AddParticipantDto]),
    __metadata("design:returntype", void 0)
], SpacesController.prototype, "addParticipant", null);
__decorate([
    (0, common_1.Delete)(':spaceId/participants/:userId'),
    (0, common_1.UseGuards)(space_member_guard_js_1.SpaceMemberGuard),
    __param(0, (0, common_1.Param)('spaceId')),
    __param(1, (0, common_1.Param)('userId')),
    __param(2, (0, current_user_decorator_js_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, index_js_1.User]),
    __metadata("design:returntype", void 0)
], SpacesController.prototype, "removeParticipant", null);
exports.SpacesController = SpacesController = __decorate([
    (0, common_1.Controller)('spaces'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [spaces_service_js_1.SpacesService])
], SpacesController);
//# sourceMappingURL=spaces.controller.js.map