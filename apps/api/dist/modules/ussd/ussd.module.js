"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UssdModule = void 0;
const common_1 = require("@nestjs/common");
const ussd_controller_1 = require("./ussd.controller");
const ussd_service_1 = require("./ussd.service");
const database_service_1 = require("../../database/database.service");
const incidents_module_1 = require("../incidents/incidents.module");
const users_module_1 = require("../users/users.module");
let UssdModule = class UssdModule {
};
exports.UssdModule = UssdModule;
exports.UssdModule = UssdModule = __decorate([
    (0, common_1.Module)({
        imports: [(0, common_1.forwardRef)(() => incidents_module_1.IncidentsModule), users_module_1.UsersModule],
        controllers: [ussd_controller_1.UssdController],
        providers: [ussd_service_1.UssdService, database_service_1.DatabaseService],
        exports: [ussd_service_1.UssdService],
    })
], UssdModule);
//# sourceMappingURL=ussd.module.js.map