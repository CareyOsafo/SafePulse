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
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const schedule_1 = require("@nestjs/schedule");
const database_module_1 = require("./database/database.module");
const auth_module_1 = require("./auth/auth.module");
const redis_module_1 = require("./redis/redis.module");
const queue_module_1 = require("./queue/queue.module");
const users_module_1 = require("./modules/users/users.module");
const contacts_module_1 = require("./modules/contacts/contacts.module");
const incidents_module_1 = require("./modules/incidents/incidents.module");
const dispatch_module_1 = require("./modules/dispatch/dispatch.module");
const units_module_1 = require("./modules/units/units.module");
const dispatcher_module_1 = require("./modules/dispatcher/dispatcher.module");
const locations_module_1 = require("./modules/locations/locations.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const ussd_module_1 = require("./modules/ussd/ussd.module");
const kyc_module_1 = require("./modules/kyc/kyc.module");
const realtime_module_1 = require("./modules/realtime/realtime.module");
const tracking_module_1 = require("./modules/tracking/tracking.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ['../../.env.local', '../../.env', '.env.local', '.env'],
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    name: 'short',
                    ttl: 1000,
                    limit: 3,
                },
                {
                    name: 'medium',
                    ttl: 10000,
                    limit: 20,
                },
                {
                    name: 'long',
                    ttl: 60000,
                    limit: 100,
                },
            ]),
            schedule_1.ScheduleModule.forRoot(),
            database_module_1.DatabaseModule,
            auth_module_1.AuthModule,
            redis_module_1.RedisModule,
            queue_module_1.QueueModule,
            users_module_1.UsersModule,
            contacts_module_1.ContactsModule,
            incidents_module_1.IncidentsModule,
            dispatch_module_1.DispatchModule,
            units_module_1.UnitsModule,
            dispatcher_module_1.DispatcherModule,
            locations_module_1.LocationsModule,
            notifications_module_1.NotificationsModule,
            ussd_module_1.UssdModule,
            kyc_module_1.KycModule,
            realtime_module_1.RealtimeModule,
            tracking_module_1.TrackingModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map