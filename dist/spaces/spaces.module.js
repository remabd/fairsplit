"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpacesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const spaces_controller_js_1 = require("./spaces.controller.js");
const spaces_service_js_1 = require("./spaces.service.js");
const index_js_1 = require("../entities/index.js");
let SpacesModule = class SpacesModule {
};
exports.SpacesModule = SpacesModule;
exports.SpacesModule = SpacesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([index_js_1.Space, index_js_1.SpaceParticipant, index_js_1.User])],
        controllers: [spaces_controller_js_1.SpacesController],
        providers: [spaces_service_js_1.SpacesService],
        exports: [spaces_service_js_1.SpacesService],
    })
], SpacesModule);
//# sourceMappingURL=spaces.module.js.map