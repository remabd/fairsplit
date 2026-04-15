"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const node_crypto_1 = require("node:crypto");
const index_js_1 = require("../entities/index.js");
let AuthService = class AuthService {
    userRepo;
    inviteTokenRepo;
    jwtService;
    constructor(userRepo, inviteTokenRepo, jwtService) {
        this.userRepo = userRepo;
        this.inviteTokenRepo = inviteTokenRepo;
        this.jwtService = jwtService;
    }
    async register(email, name, password) {
        const existing = await this.userRepo.findOneBy({ email });
        if (existing)
            throw new common_1.ConflictException('Email already in use');
        const hashedPassword = await bcrypt.hash(password, 10);
        const isFirstUser = (await this.userRepo.count()) === 0;
        const user = this.userRepo.create({
            email,
            name,
            password: hashedPassword,
            role: isFirstUser ? index_js_1.UserRole.ADMIN : index_js_1.UserRole.MEMBER,
            isActive: true,
        });
        await this.userRepo.save(user);
        return this.generateToken(user);
    }
    async login(email, password) {
        const user = await this.userRepo.findOneBy({ email });
        if (!user || !user.isActive) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const passwordValid = await bcrypt.compare(password, user.password);
        if (!passwordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return this.generateToken(user);
    }
    async createInvite(email, createdById) {
        const existing = await this.userRepo.findOneBy({ email });
        if (existing?.isActive) {
            throw new common_1.ConflictException('User with this email already exists');
        }
        if (!existing) {
            const user = this.userRepo.create({
                email,
                role: index_js_1.UserRole.MEMBER,
                isActive: false,
            });
            await this.userRepo.save(user);
        }
        const token = (0, node_crypto_1.randomUUID)();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        const invite = this.inviteTokenRepo.create({
            email,
            token,
            expiresAt,
            createdById,
        });
        await this.inviteTokenRepo.save(invite);
        return { token, email };
    }
    async acceptInvite(token, name, password) {
        const invite = await this.inviteTokenRepo.findOneBy({ token });
        if (!invite)
            throw new common_1.BadRequestException('Invalid invite token');
        if (invite.usedAt)
            throw new common_1.BadRequestException('Invite already used');
        if (new Date() > invite.expiresAt)
            throw new common_1.BadRequestException('Invite expired');
        const user = await this.userRepo.findOneBy({ email: invite.email });
        if (!user)
            throw new common_1.BadRequestException('User not found');
        user.name = name;
        user.password = await bcrypt.hash(password, 10);
        user.isActive = true;
        await this.userRepo.save(user);
        invite.usedAt = new Date();
        await this.inviteTokenRepo.save(invite);
        return this.generateToken(user);
    }
    generateToken(user) {
        const payload = { sub: user.id, email: user.email, role: user.role };
        return { accessToken: this.jwtService.sign(payload) };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(index_js_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(index_js_1.InviteToken)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map