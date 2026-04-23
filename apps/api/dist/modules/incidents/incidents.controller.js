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
exports.IncidentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const incidents_service_1 = require("./incidents.service");
const current_user_decorator_1 = require("../../auth/decorators/current-user.decorator");
const incident_dto_1 = require("./dto/incident.dto");
const throttler_1 = require("@nestjs/throttler");
let IncidentsController = class IncidentsController {
    constructor(incidentsService) {
        this.incidentsService = incidentsService;
    }
    async createIncident(user, dto, idempotencyKey) {
        return this.incidentsService.createIncident(user, dto, idempotencyKey);
    }
    async updateLocation(user, incidentId, dto) {
        return this.incidentsService.updateLocation(user, incidentId, dto);
    }
    async cancelIncident(user, incidentId) {
        return this.incidentsService.cancelIncident(user, incidentId);
    }
    async markSafe(user, incidentId) {
        return this.incidentsService.markSafe(user, incidentId);
    }
    async getIncident(user, incidentId) {
        return this.incidentsService.getIncidentForUser(user, incidentId);
    }
    async getUserIncidents(user) {
        return this.incidentsService.getUserIncidents(user.id);
    }
};
exports.IncidentsController = IncidentsController;
__decorate([
    (0, common_1.Post)(),
    (0, throttler_1.Throttle)({ short: { ttl: 60000, limit: 5 } }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new emergency incident' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Incident created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid request data' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'KYC verification failed' }),
    (0, swagger_1.ApiResponse)({ status: 429, description: 'Rate limit exceeded' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Headers)('x-idempotency-key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, incident_dto_1.CreateIncidentDto, String]),
    __metadata("design:returntype", Promise)
], IncidentsController.prototype, "createIncident", null);
__decorate([
    (0, common_1.Post)(':id/location'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Update incident location (live tracking)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Location updated' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Incident not found' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, incident_dto_1.UpdateLocationDto]),
    __metadata("design:returntype", Promise)
], IncidentsController.prototype, "updateLocation", null);
__decorate([
    (0, common_1.Post)(':id/cancel'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel an active incident' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Incident cancelled' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Incident not found' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Incident cannot be cancelled' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], IncidentsController.prototype, "cancelIncident", null);
__decorate([
    (0, common_1.Post)(':id/mark-safe'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Mark caller as safe' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Marked as safe' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Incident not found' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], IncidentsController.prototype, "markSafe", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get incident details' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Incident details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Incident not found' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], IncidentsController.prototype, "getIncident", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get user incident history' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of incidents' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], IncidentsController.prototype, "getUserIncidents", null);
exports.IncidentsController = IncidentsController = __decorate([
    (0, swagger_1.ApiTags)('incidents'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('incidents'),
    __metadata("design:paramtypes", [incidents_service_1.IncidentsService])
], IncidentsController);
//# sourceMappingURL=incidents.controller.js.map