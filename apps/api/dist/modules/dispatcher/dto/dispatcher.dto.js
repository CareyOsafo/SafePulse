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
exports.SendMessageDto = exports.AssignUnitDto = exports.AddNotesDto = exports.UpdateIncidentStatusDto = exports.AcknowledgeIncidentDto = exports.IncidentFiltersDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const shared_1 = require("@safepulse/shared");
class IncidentFiltersDto {
}
exports.IncidentFiltersDto = IncidentFiltersDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: shared_1.IncidentStatus, isArray: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_transformer_1.Transform)(({ value }) => (Array.isArray(value) ? value : [value])),
    __metadata("design:type", Array)
], IncidentFiltersDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: shared_1.EmergencyType, isArray: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_transformer_1.Transform)(({ value }) => (Array.isArray(value) ? value : [value])),
    __metadata("design:type", Array)
], IncidentFiltersDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: shared_1.IncidentPriority, isArray: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_transformer_1.Transform)(({ value }) => (Array.isArray(value) ? value : [value])),
    __metadata("design:type", Array)
], IncidentFiltersDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IncidentFiltersDto.prototype, "region", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], IncidentFiltersDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], IncidentFiltersDto.prototype, "offset", void 0);
class AcknowledgeIncidentDto {
}
exports.AcknowledgeIncidentDto = AcknowledgeIncidentDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Initial dispatcher notes' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AcknowledgeIncidentDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Auto-dispatch to nearest units', default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], AcknowledgeIncidentDto.prototype, "autoDispatch", void 0);
class UpdateIncidentStatusDto {
}
exports.UpdateIncidentStatusDto = UpdateIncidentStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: shared_1.IncidentStatus }),
    (0, class_validator_1.IsEnum)(shared_1.IncidentStatus),
    __metadata("design:type", String)
], UpdateIncidentStatusDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Reason for status change' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateIncidentStatusDto.prototype, "reason", void 0);
class AddNotesDto {
}
exports.AddNotesDto = AddNotesDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Dispatcher notes to add' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddNotesDto.prototype, "notes", void 0);
class AssignUnitDto {
}
exports.AssignUnitDto = AssignUnitDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unit ID to assign' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], AssignUnitDto.prototype, "unitId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Is this the primary responder', default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], AssignUnitDto.prototype, "isPrimary", void 0);
class SendMessageDto {
}
exports.SendMessageDto = SendMessageDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Recipient phone number' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendMessageDto.prototype, "recipientPhone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Message content' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendMessageDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: shared_1.NotificationChannel }),
    (0, class_validator_1.IsEnum)(shared_1.NotificationChannel),
    __metadata("design:type", String)
], SendMessageDto.prototype, "channel", void 0);
//# sourceMappingURL=dispatcher.dto.js.map