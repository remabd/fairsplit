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
exports.Settlement = void 0;
const typeorm_1 = require("typeorm");
const space_entity_js_1 = require("./space.entity.js");
const user_entity_js_1 = require("./user.entity.js");
let Settlement = class Settlement {
    id;
    space;
    spaceId;
    fromUser;
    fromUserId;
    toUser;
    toUserId;
    amount;
    createdAt;
};
exports.Settlement = Settlement;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Settlement.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => space_entity_js_1.Space, (space) => space.settlements, {
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", space_entity_js_1.Space)
], Settlement.prototype, "space", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Settlement.prototype, "spaceId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_js_1.User),
    __metadata("design:type", user_entity_js_1.User)
], Settlement.prototype, "fromUser", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Settlement.prototype, "fromUserId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_js_1.User),
    __metadata("design:type", user_entity_js_1.User)
], Settlement.prototype, "toUser", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Settlement.prototype, "toUserId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'real' }),
    __metadata("design:type", Number)
], Settlement.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Settlement.prototype, "createdAt", void 0);
exports.Settlement = Settlement = __decorate([
    (0, typeorm_1.Entity)()
], Settlement);
//# sourceMappingURL=settlement.entity.js.map