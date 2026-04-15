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
exports.Space = void 0;
const typeorm_1 = require("typeorm");
const space_participant_entity_js_1 = require("./space-participant.entity.js");
const expense_entity_js_1 = require("./expense.entity.js");
const settlement_entity_js_1 = require("./settlement.entity.js");
let Space = class Space {
    id;
    name;
    currency;
    createdAt;
    participants;
    expenses;
    settlements;
};
exports.Space = Space;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Space.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Space.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'EUR' }),
    __metadata("design:type", String)
], Space.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Space.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => space_participant_entity_js_1.SpaceParticipant, (sp) => sp.space),
    __metadata("design:type", Array)
], Space.prototype, "participants", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => expense_entity_js_1.Expense, (e) => e.space),
    __metadata("design:type", Array)
], Space.prototype, "expenses", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => settlement_entity_js_1.Settlement, (s) => s.space),
    __metadata("design:type", Array)
], Space.prototype, "settlements", void 0);
exports.Space = Space = __decorate([
    (0, typeorm_1.Entity)()
], Space);
//# sourceMappingURL=space.entity.js.map