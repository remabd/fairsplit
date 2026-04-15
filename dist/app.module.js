"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const index_js_1 = require("./entities/index.js");
const auth_module_js_1 = require("./auth/auth.module.js");
const spaces_module_js_1 = require("./spaces/spaces.module.js");
const expenses_module_js_1 = require("./expenses/expenses.module.js");
const settlements_module_js_1 = require("./settlements/settlements.module.js");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: 'better-sqlite3',
                database: process.env.DB_PATH ?? 'fairsplit.db',
                entities: [
                    index_js_1.User,
                    index_js_1.Space,
                    index_js_1.SpaceParticipant,
                    index_js_1.Expense,
                    index_js_1.ExpenseSplit,
                    index_js_1.Settlement,
                    index_js_1.InviteToken,
                ],
                synchronize: true,
            }),
            auth_module_js_1.AuthModule,
            spaces_module_js_1.SpacesModule,
            expenses_module_js_1.ExpensesModule,
            settlements_module_js_1.SettlementsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map