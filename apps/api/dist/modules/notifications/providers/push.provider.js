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
exports.PushProvider = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let PushProvider = class PushProvider {
    constructor(configService) {
        this.configService = configService;
    }
    async send(deviceToken, payload) {
        const isProduction = this.configService.get('NODE_ENV') === 'production';
        if (!isProduction) {
            console.log('[PUSH STUB] Sending push notification:', {
                deviceToken: deviceToken.substring(0, 10) + '...',
                payload,
            });
            return {
                success: true,
                providerMessageId: `push-${Date.now()}`,
            };
        }
        return {
            success: false,
            error: 'Push provider not configured for production',
        };
    }
};
exports.PushProvider = PushProvider;
exports.PushProvider = PushProvider = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], PushProvider);
//# sourceMappingURL=push.provider.js.map