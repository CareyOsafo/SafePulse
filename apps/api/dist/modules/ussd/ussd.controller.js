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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UssdController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const ussd_service_1 = require("./ussd.service");
const public_decorator_1 = require("../../auth/decorators/public.decorator");
const ussd_auth_guard_1 = require("../../auth/guards/ussd-auth.guard");
const ussd_dto_1 = require("./dto/ussd.dto");
const throttler_1 = require("@nestjs/throttler");
let UssdController = class UssdController {
    constructor(ussdService) {
        this.ussdService = ussdService;
    }
    async handleSession(dto) {
        return this.ussdService.handleSession(dto);
    }
};
exports.UssdController = UssdController;
__decorate([
    (0, common_1.Post)('session'),
    (0, public_decorator_1.Public)(),
    (0, common_1.UseGuards)(ussd_auth_guard_1.UssdAuthGuard),
    (0, throttler_1.Throttle)({ short: { ttl: 1000, limit: 10 } }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Handle USSD session request from telco aggregator' }),
    (0, swagger_1.ApiHeader)({ name: 'x-ussd-secret', description: 'USSD webhook shared secret' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'USSD response' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid authentication' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ussd_dto_1.UssdRequestDto]),
    __metadata("design:returntype", Promise)
], UssdController.prototype, "handleSession", null);
exports.UssdController = UssdController = __decorate([
    (0, swagger_1.ApiTags)('ussd'),
    (0, common_1.Controller)('ussd'),
    __metadata("design:paramtypes", [ussd_service_1.UssdService])
], UssdController);
//# sourceMappingURL=ussd.controller.js.map