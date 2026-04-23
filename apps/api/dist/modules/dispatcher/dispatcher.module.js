"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DispatcherModule = void 0;
const common_1 = require("@nestjs/common");
const dispatcher_controller_1 = require("./dispatcher.controller");
const dispatcher_service_1 = require("./dispatcher.service");
const database_service_1 = require("../../database/database.service");
const dispatch_module_1 = require("../dispatch/dispatch.module");
const realtime_module_1 = require("../realtime/realtime.module");
const notifications_module_1 = require("../notifications/notifications.module");
let DispatcherModule = class DispatcherModule {
};
exports.DispatcherModule = DispatcherModule;
exports.DispatcherModule = DispatcherModule = __decorate([
    (0, common_1.Module)({
        imports: [
            (0, common_1.forwardRef)(() => dispatch_module_1.DispatchModule),
            (0, common_1.forwardRef)(() => realtime_module_1.RealtimeModule),
            (0, common_1.forwardRef)(() => notifications_module_1.NotificationsModule),
        ],
        controllers: [dispatcher_controller_1.DispatcherController],
        providers: [dispatcher_service_1.DispatcherService, database_service_1.DatabaseService],
        exports: [dispatcher_service_1.DispatcherService],
    })
], DispatcherModule);
//# sourceMappingURL=dispatcher.module.js.map