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
exports.UssdAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let UssdAuthGuard = class UssdAuthGuard {
    constructor(configService) {
        this.configService = configService;
    }
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const sharedSecret = this.configService.get('USSD_SHARED_SECRET');
        if (!sharedSecret) {
            if (this.configService.get('NODE_ENV') === 'development') {
                return true;
            }
            throw new common_1.UnauthorizedException('USSD authentication not configured');
        }
        const providedSecret = request.headers['x-ussd-secret'] || request.headers['authorization'];
        if (!providedSecret || providedSecret !== sharedSecret) {
            throw new common_1.UnauthorizedException('Invalid USSD authentication');
        }
        return true;
    }
};
exports.UssdAuthGuard = UssdAuthGuard;
exports.UssdAuthGuard = UssdAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], UssdAuthGuard);
//# sourceMappingURL=ussd-auth.guard.js.map