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
exports.UnitsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const units_service_1 = require("./units.service");
const current_user_decorator_1 = require("../../auth/decorators/current-user.decorator");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const shared_1 = require("@safepulse/shared");
const unit_dto_1 = require("./dto/unit.dto");
let UnitsController = class UnitsController {
    constructor(unitsService) {
        this.unitsService = unitsService;
    }
    async getMyUnit(user) {
        return this.unitsService.getUnitByUserId(user.id);
    }
    async updateMyStatus(user, dto) {
        return this.unitsService.updateUnitStatus(user.unitId, dto);
    }
    async updateMyLocation(user, dto) {
        return this.unitsService.updateUnitLocation(user.unitId, dto);
    }
    async getMyAssignments(user, active) {
        return this.unitsService.getUnitAssignments(user.unitId, active);
    }
    async acceptAssignment(user, assignmentId) {
        return this.unitsService.acceptAssignment(user.unitId, assignmentId);
    }
    async declineAssignment(user, assignmentId, dto) {
        return this.unitsService.declineAssignment(user.unitId, assignmentId, dto.reason);
    }
    async getAssignment(user, assignmentId) {
        return this.unitsService.getAssignmentDetails(user.unitId, assignmentId);
    }
    async updateIncidentStatus(user, incidentId, dto) {
        return this.unitsService.updateIncidentStatus(user.unitId, incidentId, dto);
    }
    async pingLocation(user, incidentId, dto) {
        return this.unitsService.recordLocationPing(user.unitId, incidentId, dto);
    }
    async resolveIncident(user, incidentId, dto) {
        return this.unitsService.resolveIncident(user.unitId, incidentId, dto?.notes);
    }
    async requestBackup(user, incidentId, dto) {
        return this.unitsService.requestBackup(user.unitId, incidentId, dto?.notes);
    }
    async cantLocate(user, incidentId, dto) {
        return this.unitsService.reportCantLocate(user.unitId, incidentId, dto?.notes);
    }
    async getHistory(user, limit = 50, offset = 0) {
        return this.unitsService.getAssignmentHistory(user.unitId, limit, offset);
    }
};
exports.UnitsController = UnitsController;
__decorate([
    (0, common_1.Get)('me'),
    (0, roles_decorator_1.Roles)(shared_1.AppRole.UNIT),
    (0, swagger_1.ApiOperation)({ summary: 'Get current unit profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Unit profile' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UnitsController.prototype, "getMyUnit", null);
__decorate([
    (0, common_1.Post)('me/status'),
    (0, roles_decorator_1.Roles)(shared_1.AppRole.UNIT),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Update unit status (Available/Busy/Offline)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Status updated' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, unit_dto_1.UpdateUnitStatusDto]),
    __metadata("design:returntype", Promise)
], UnitsController.prototype, "updateMyStatus", null);
__decorate([
    (0, common_1.Post)('me/location'),
    (0, roles_decorator_1.Roles)(shared_1.AppRole.UNIT),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Update unit location' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Location updated' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, unit_dto_1.UnitLocationDto]),
    __metadata("design:returntype", Promise)
], UnitsController.prototype, "updateMyLocation", null);
__decorate([
    (0, common_1.Get)('me/assignments'),
    (0, roles_decorator_1.Roles)(shared_1.AppRole.UNIT),
    (0, swagger_1.ApiOperation)({ summary: 'Get unit assignments' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of assignments' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('active')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Boolean]),
    __metadata("design:returntype", Promise)
], UnitsController.prototype, "getMyAssignments", null);
__decorate([
    (0, common_1.Post)('assignments/:assignmentId/accept'),
    (0, roles_decorator_1.Roles)(shared_1.AppRole.UNIT),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Accept an assignment offer' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Assignment accepted' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Assignment expired or already responded' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('assignmentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UnitsController.prototype, "acceptAssignment", null);
__decorate([
    (0, common_1.Post)('assignments/:assignmentId/decline'),
    (0, roles_decorator_1.Roles)(shared_1.AppRole.UNIT),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Decline an assignment offer' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Assignment declined' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('assignmentId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, unit_dto_1.DeclineAssignmentDto]),
    __metadata("design:returntype", Promise)
], UnitsController.prototype, "declineAssignment", null);
__decorate([
    (0, common_1.Get)('assignments/:assignmentId'),
    (0, roles_decorator_1.Roles)(shared_1.AppRole.UNIT),
    (0, swagger_1.ApiOperation)({ summary: 'Get assignment details' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Assignment details with incident info' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('assignmentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UnitsController.prototype, "getAssignment", null);
__decorate([
    (0, common_1.Post)('incidents/:incidentId/status'),
    (0, roles_decorator_1.Roles)(shared_1.AppRole.UNIT),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Update incident status (en_route, on_scene)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Status updated' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('incidentId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, unit_dto_1.UpdateIncidentStatusDto]),
    __metadata("design:returntype", Promise)
], UnitsController.prototype, "updateIncidentStatus", null);
__decorate([
    (0, common_1.Post)('incidents/:incidentId/location'),
    (0, roles_decorator_1.Roles)(shared_1.AppRole.UNIT),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Send unit location ping for active incident' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Location recorded' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('incidentId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, unit_dto_1.UnitLocationDto]),
    __metadata("design:returntype", Promise)
], UnitsController.prototype, "pingLocation", null);
__decorate([
    (0, common_1.Post)('incidents/:incidentId/resolve'),
    (0, roles_decorator_1.Roles)(shared_1.AppRole.UNIT),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Resolve incident (long press to confirm)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Incident resolved' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('incidentId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], UnitsController.prototype, "resolveIncident", null);
__decorate([
    (0, common_1.Post)('incidents/:incidentId/need-backup'),
    (0, roles_decorator_1.Roles)(shared_1.AppRole.UNIT),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Request backup for incident' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Backup requested' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('incidentId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], UnitsController.prototype, "requestBackup", null);
__decorate([
    (0, common_1.Post)('incidents/:incidentId/cant-locate'),
    (0, roles_decorator_1.Roles)(shared_1.AppRole.UNIT),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Report unable to locate caller' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Reported' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('incidentId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], UnitsController.prototype, "cantLocate", null);
__decorate([
    (0, common_1.Get)('history'),
    (0, roles_decorator_1.Roles)(shared_1.AppRole.UNIT),
    (0, swagger_1.ApiOperation)({ summary: 'Get unit assignment history' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Assignment history' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], UnitsController.prototype, "getHistory", null);
exports.UnitsController = UnitsController = __decorate([
    (0, swagger_1.ApiTags)('units'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('unit'),
    __metadata("design:paramtypes", [units_service_1.UnitsService])
], UnitsController);
//# sourceMappingURL=units.controller.js.map