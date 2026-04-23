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
exports.DispatcherController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const dispatcher_service_1 = require("./dispatcher.service");
const current_user_decorator_1 = require("../../auth/decorators/current-user.decorator");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const shared_1 = require("@safepulse/shared");
const dispatcher_dto_1 = require("./dto/dispatcher.dto");
let DispatcherController = class DispatcherController {
    constructor(dispatcherService) {
        this.dispatcherService = dispatcherService;
    }
    async getIncidents(user, filters) {
        if (!user.agencyId) {
            throw new common_1.ForbiddenException('User is not linked to an agency');
        }
        return this.dispatcherService.getIncidents(user.agencyId, filters);
    }
    async getIncidentDetails(user, incidentId) {
        if (!user.agencyId) {
            throw new common_1.ForbiddenException('User is not linked to an agency');
        }
        return this.dispatcherService.getIncidentDetails(user.agencyId, incidentId);
    }
    async acknowledgeIncident(user, incidentId, dto) {
        return this.dispatcherService.acknowledgeIncident(user, incidentId, dto);
    }
    async updateIncidentStatus(user, incidentId, dto) {
        return this.dispatcherService.updateIncidentStatus(user, incidentId, dto);
    }
    async addNotes(user, incidentId, dto) {
        return this.dispatcherService.addNotes(user, incidentId, dto.notes);
    }
    async assignUnit(user, incidentId, dto) {
        if (!user.agencyId) {
            throw new common_1.ForbiddenException('User is not linked to an agency');
        }
        return this.dispatcherService.assignUnit(user, incidentId, dto);
    }
    async sendMessage(user, incidentId, dto) {
        return this.dispatcherService.sendMessage(user, incidentId, dto);
    }
    async getTimeline(user, incidentId) {
        return this.dispatcherService.getIncidentTimeline(incidentId);
    }
    async getLocationHistory(user, incidentId) {
        return this.dispatcherService.getLocationHistory(incidentId);
    }
    async getDeliveryLogs(user, incidentId) {
        return this.dispatcherService.getDeliveryLogs(incidentId);
    }
    async getUnits(user, status) {
        if (!user.agencyId) {
            throw new common_1.ForbiddenException('User is not linked to an agency');
        }
        return this.dispatcherService.getAgencyUnits(user.agencyId, status);
    }
    async updateUnitStatus(user, unitId, dto) {
        return this.dispatcherService.updateUnitStatus(user, unitId, dto.status);
    }
    async getIncidentReport(user, startDate, endDate, format = 'json') {
        if (!user.agencyId) {
            throw new common_1.ForbiddenException('User is not linked to an agency');
        }
        return this.dispatcherService.getIncidentReport(user.agencyId, startDate, endDate, format);
    }
    async getStats(user) {
        if (!user.agencyId) {
            throw new common_1.ForbiddenException('User is not linked to an agency');
        }
        return this.dispatcherService.getDashboardStats(user.agencyId);
    }
};
exports.DispatcherController = DispatcherController;
__decorate([
    (0, common_1.Get)('incidents'),
    (0, swagger_1.ApiOperation)({ summary: 'Get incidents for dispatcher queue' }),
    (0, swagger_1.ApiQuery)({ name: 'status', enum: shared_1.IncidentStatus, isArray: true, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'type', enum: shared_1.EmergencyType, isArray: true, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'priority', enum: shared_1.IncidentPriority, isArray: true, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'region', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'offset', required: false }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of incidents' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dispatcher_dto_1.IncidentFiltersDto]),
    __metadata("design:returntype", Promise)
], DispatcherController.prototype, "getIncidents", null);
__decorate([
    (0, common_1.Get)('incidents/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get incident details' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Incident details with timeline and assignments' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DispatcherController.prototype, "getIncidentDetails", null);
__decorate([
    (0, common_1.Post)('incidents/:id/acknowledge'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Acknowledge an incident' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Incident acknowledged' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, dispatcher_dto_1.AcknowledgeIncidentDto]),
    __metadata("design:returntype", Promise)
], DispatcherController.prototype, "acknowledgeIncident", null);
__decorate([
    (0, common_1.Post)('incidents/:id/status'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Update incident status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Status updated' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, dispatcher_dto_1.UpdateIncidentStatusDto]),
    __metadata("design:returntype", Promise)
], DispatcherController.prototype, "updateIncidentStatus", null);
__decorate([
    (0, common_1.Post)('incidents/:id/notes'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Add dispatcher notes' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Notes added' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, dispatcher_dto_1.AddNotesDto]),
    __metadata("design:returntype", Promise)
], DispatcherController.prototype, "addNotes", null);
__decorate([
    (0, common_1.Post)('incidents/:id/assign'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Assign a unit to incident' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Unit assigned' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, dispatcher_dto_1.AssignUnitDto]),
    __metadata("design:returntype", Promise)
], DispatcherController.prototype, "assignUnit", null);
__decorate([
    (0, common_1.Post)('incidents/:id/message'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Send message to caller or contact' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Message sent' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, dispatcher_dto_1.SendMessageDto]),
    __metadata("design:returntype", Promise)
], DispatcherController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Get)('incidents/:id/timeline'),
    (0, swagger_1.ApiOperation)({ summary: 'Get incident event timeline' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of incident events' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DispatcherController.prototype, "getTimeline", null);
__decorate([
    (0, common_1.Get)('incidents/:id/locations'),
    (0, swagger_1.ApiOperation)({ summary: 'Get incident location history' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of location snapshots' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DispatcherController.prototype, "getLocationHistory", null);
__decorate([
    (0, common_1.Get)('incidents/:id/deliveries'),
    (0, swagger_1.ApiOperation)({ summary: 'Get incident delivery logs' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of delivery logs' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DispatcherController.prototype, "getDeliveryLogs", null);
__decorate([
    (0, common_1.Get)('units'),
    (0, swagger_1.ApiOperation)({ summary: 'Get units for agency' }),
    (0, swagger_1.ApiQuery)({ name: 'status', enum: ['available', 'busy', 'offline'], required: false }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of units' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DispatcherController.prototype, "getUnits", null);
__decorate([
    (0, common_1.Post)('units/:id/status'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Update unit status (dispatcher override)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Unit status updated' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], DispatcherController.prototype, "updateUnitStatus", null);
__decorate([
    (0, common_1.Get)('reports/incidents'),
    (0, swagger_1.ApiOperation)({ summary: 'Get incident reports for export' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: true }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: true }),
    (0, swagger_1.ApiQuery)({ name: 'format', enum: ['json', 'csv'], required: false }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Incident report data' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __param(3, (0, common_1.Query)('format')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], DispatcherController.prototype, "getIncidentReport", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get dashboard statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Dashboard stats' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DispatcherController.prototype, "getStats", null);
exports.DispatcherController = DispatcherController = __decorate([
    (0, swagger_1.ApiTags)('dispatcher'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('dispatcher'),
    (0, roles_decorator_1.Roles)(shared_1.AppRole.DISPATCHER, shared_1.AppRole.SUPERVISOR, shared_1.AppRole.ADMIN),
    __metadata("design:paramtypes", [dispatcher_service_1.DispatcherService])
], DispatcherController);
//# sourceMappingURL=dispatcher.controller.js.map