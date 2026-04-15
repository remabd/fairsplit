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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpaceParticipant = void 0;
const typeorm_1 = require("typeorm");
const user_entity_js_1 = require("./user.entity.js");
const space_entity_js_1 = require("./space.entity.js");
let SpaceParticipant = class SpaceParticipant {
    id;
    space;
    spaceId;
    user;
    userId;
    isActive;
    joinedAt;
    leftAt;
};
exports.SpaceParticipant = SpaceParticipant;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SpaceParticipant.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => space_entity_js_1.Space, (space) => space.participants, {
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", space_entity_js_1.Space)
], SpaceParticipant.prototype, "space", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SpaceParticipant.prototype, "spaceId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_js_1.User, (user) => user.spaceParticipants),
    __metadata("design:type", user_entity_js_1.User)
], SpaceParticipant.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SpaceParticipant.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], SpaceParticipant.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], SpaceParticipant.prototype, "joinedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Object)
], SpaceParticipant.prototype, "leftAt", void 0);
exports.SpaceParticipant = SpaceParticipant = __decorate([
    (0, typeorm_1.Entity)()
], SpaceParticipant);
//# sourceMappingURL=space-participant.entity.js.map