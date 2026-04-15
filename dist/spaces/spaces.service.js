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
exports.SpacesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const index_js_1 = require("../entities/index.js");
let SpacesService = class SpacesService {
    spaceRepo;
    participantRepo;
    userRepo;
    constructor(spaceRepo, participantRepo, userRepo) {
        this.spaceRepo = spaceRepo;
        this.participantRepo = participantRepo;
        this.userRepo = userRepo;
    }
    async create(name, currency, creatorId) {
        const space = this.spaceRepo.create({ name, currency });
        await this.spaceRepo.save(space);
        const participant = this.participantRepo.create({
            spaceId: space.id,
            userId: creatorId,
        });
        await this.participantRepo.save(participant);
        return space;
    }
    async findAllForUser(userId) {
        const participations = await this.participantRepo.find({
            where: { userId, isActive: true },
            relations: ['space'],
        });
        return participations.map((p) => p.space);
    }
    async findOne(spaceId) {
        const space = await this.spaceRepo.findOne({
            where: { id: spaceId },
            relations: ['participants', 'participants.user'],
        });
        if (!space)
            throw new common_1.NotFoundException('Space not found');
        return space;
    }
    async addParticipant(spaceId, userId) {
        const user = await this.userRepo.findOneBy({ id: userId });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const existing = await this.participantRepo.findOneBy({
            spaceId,
            userId,
        });
        if (existing) {
            if (existing.isActive) {
                throw new common_1.ConflictException('User is already a participant');
            }
            existing.isActive = true;
            existing.leftAt = null;
            return this.participantRepo.save(existing);
        }
        const participant = this.participantRepo.create({ spaceId, userId });
        return this.participantRepo.save(participant);
    }
    async removeParticipant(spaceId, userId, requestingUser) {
        if (requestingUser.role !== index_js_1.UserRole.ADMIN) {
            throw new common_1.ForbiddenException('Only admin can remove participants');
        }
        const participant = await this.participantRepo.findOneBy({
            spaceId,
            userId,
            isActive: true,
        });
        if (!participant) {
            throw new common_1.NotFoundException('Participant not found');
        }
        participant.isActive = false;
        participant.leftAt = new Date();
        await this.participantRepo.save(participant);
    }
};
exports.SpacesService = SpacesService;
exports.SpacesService = SpacesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(index_js_1.Space)),
    __param(1, (0, typeorm_1.InjectRepository)(index_js_1.SpaceParticipant)),
    __param(2, (0, typeorm_1.InjectRepository)(index_js_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], SpacesService);
//# sourceMappingURL=spaces.service.js.map