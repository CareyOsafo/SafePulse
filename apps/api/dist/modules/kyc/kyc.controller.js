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
exports.KycController = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const swagger_1 = require("@nestjs/swagger");
const kyc_service_1 = require("./kyc.service");
const current_user_decorator_1 = require("../../auth/decorators/current-user.decorator");
const public_decorator_1 = require("../../auth/decorators/public.decorator");
const kyc_dto_1 = require("./dto/kyc.dto");
let KycController = class KycController {
    constructor(kycService, configService) {
        this.kycService = kycService;
        this.configService = configService;
    }
    async startKyc(user, dto) {
        return this.kycService.startVerification(user.id, dto);
    }
    async getStatus(user) {
        return this.kycService.getStatus(user.id);
    }
    async retryKyc(user, dto) {
        return this.kycService.retryVerification(user.id, dto);
    }
    async handleMetaMapWebhook(signature, body, req) {
        return this.kycService.handleWebhook(signature, body, req.rawBody);
    }
    async testKyc(userId, dto) {
        if (this.configService.get('NODE_ENV') === 'production') {
            throw new common_1.ForbiddenException('Test endpoint not available in production');
        }
        return this.kycService.startVerification(userId, dto);
    }
    async testGetStatus(userId) {
        if (this.configService.get('NODE_ENV') === 'production') {
            throw new common_1.ForbiddenException('Test endpoint not available in production');
        }
        return this.kycService.getStatus(userId);
    }
};
exports.KycController = KycController;
__decorate([
    (0, common_1.Post)('start'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Start KYC verification with Ghana Card' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Verification started, returns verification URL' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid Ghana Card number or already verified' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Ghana Card already registered' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, kyc_dto_1.StartKycDto]),
    __metadata("design:returntype", Promise)
], KycController.prototype, "startKyc", null);
__decorate([
    (0, common_1.Get)('status'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get current KYC status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'KYC status' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], KycController.prototype, "getStatus", null);
__decorate([
    (0, common_1.Post)('retry'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Retry KYC verification after failure' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retry initiated' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Cannot retry at this time' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, kyc_dto_1.StartKycDto]),
    __metadata("design:returntype", Promise)
], KycController.prototype, "retryKyc", null);
__decorate([
    (0, common_1.Post)('/webhooks/metamap'),
    (0, public_decorator_1.Public)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'MetaMap webhook receiver' }),
    (0, swagger_1.ApiHeader)({ name: 'x-metamap-signature', description: 'Webhook signature' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Webhook processed' }),
    __param(0, (0, common_1.Headers)('x-metamap-signature')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], KycController.prototype, "handleMetaMapWebhook", null);
__decorate([
    (0, common_1.Post)('test'),
    (0, public_decorator_1.Public)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: '[DEV ONLY] Test KYC verification without auth' }),
    (0, swagger_1.ApiQuery)({ name: 'userId', required: true, description: 'User ID to verify' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Verification result' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Only available in development' }),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, kyc_dto_1.StartKycDto]),
    __metadata("design:returntype", Promise)
], KycController.prototype, "testKyc", null);
__decorate([
    (0, common_1.Get)('test/status'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: '[DEV ONLY] Get KYC status without auth' }),
    (0, swagger_1.ApiQuery)({ name: 'userId', required: true, description: 'User ID to check' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'KYC status' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Only available in development' }),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], KycController.prototype, "testGetStatus", null);
exports.KycController = KycController = __decorate([
    (0, swagger_1.ApiTags)('kyc'),
    (0, common_1.Controller)('kyc'),
    __metadata("design:paramtypes", [kyc_service_1.KycService,
        config_1.ConfigService])
], KycController);
//# sourceMappingURL=kyc.controller.js.map