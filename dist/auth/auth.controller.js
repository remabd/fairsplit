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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const auth_service_js_1 = require("./auth.service.js");
const login_dto_js_1 = require("./dto/login.dto.js");
const register_dto_js_1 = require("./dto/register.dto.js");
const invite_dto_js_1 = require("./dto/invite.dto.js");
const accept_invite_dto_js_1 = require("./dto/accept-invite.dto.js");
const current_user_decorator_js_1 = require("../common/decorators/current-user.decorator.js");
const roles_guard_js_1 = require("../common/guards/roles.guard.js");
const roles_guard_js_2 = require("../common/guards/roles.guard.js");
const index_js_1 = require("../entities/index.js");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    register(dto) {
        return this.authService.register(dto.email, dto.name, dto.password);
    }
    login(dto) {
        return this.authService.login(dto.email, dto.password);
    }
    invite(dto, user) {
        return this.authService.createInvite(dto.email, user.id);
    }
    acceptInvite(dto) {
        return this.authService.acceptInvite(dto.token, dto.name, dto.password);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_js_1.RegisterDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_js_1.LoginDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('invite'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_js_2.RolesGuard),
    (0, roles_guard_js_1.Roles)(index_js_1.UserRole.ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_js_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [invite_dto_js_1.InviteDto, index_js_1.User]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "invite", null);
__decorate([
    (0, common_1.Post)('accept-invite'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [accept_invite_dto_js_1.AcceptInviteDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "acceptInvite", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_js_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map