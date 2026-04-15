"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettlementsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const settlements_controller_js_1 = require("./settlements.controller.js");
const settlements_service_js_1 = require("./settlements.service.js");
const index_js_1 = require("../entities/index.js");
let SettlementsModule = class SettlementsModule {
};
exports.SettlementsModule = SettlementsModule;
exports.SettlementsModule = SettlementsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                index_js_1.Settlement,
                index_js_1.Expense,
                index_js_1.ExpenseSplit,
                index_js_1.SpaceParticipant,
            ]),
        ],
        controllers: [settlements_controller_js_1.SettlementsController],
        providers: [settlements_service_js_1.SettlementsService],
        exports: [settlements_service_js_1.SettlementsService],
    })
], SettlementsModule);
//# sourceMappingURL=settlements.module.js.map