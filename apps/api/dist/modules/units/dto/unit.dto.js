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
exports.AcceptAssignmentDto = exports.UnitLocationDto = exports.UpdateIncidentStatusDto = exports.DeclineAssignmentDto = exports.UpdateUnitStatusDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const shared_1 = require("@safepulse/shared");
class UpdateUnitStatusDto {
}
exports.UpdateUnitStatusDto = UpdateUnitStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: shared_1.UnitStatus, description: 'Unit status' }),
    (0, class_validator_1.IsEnum)(shared_1.UnitStatus),
    __metadata("design:type", String)
], UpdateUnitStatusDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Whether unit is on duty' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateUnitStatusDto.prototype, "isOnDuty", void 0);
class DeclineAssignmentDto {
}
exports.DeclineAssignmentDto = DeclineAssignmentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Reason for declining' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DeclineAssignmentDto.prototype, "reason", void 0);
class UpdateIncidentStatusDto {
}
exports.UpdateIncidentStatusDto = UpdateIncidentStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: [shared_1.IncidentStatus.EN_ROUTE, shared_1.IncidentStatus.ON_SCENE],
        description: 'New status',
    }),
    (0, class_validator_1.IsEnum)(shared_1.IncidentStatus),
    __metadata("design:type", String)
], UpdateIncidentStatusDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional notes' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateIncidentStatusDto.prototype, "notes", void 0);
class UnitLocationDto {
}
exports.UnitLocationDto = UnitLocationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Latitude' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(-90),
    (0, class_validator_1.Max)(90),
    __metadata("design:type", Number)
], UnitLocationDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Longitude' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(-180),
    (0, class_validator_1.Max)(180),
    __metadata("design:type", Number)
], UnitLocationDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Accuracy in meters' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UnitLocationDto.prototype, "accuracy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Heading in degrees' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(360),
    __metadata("design:type", Number)
], UnitLocationDto.prototype, "heading", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Speed in m/s' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UnitLocationDto.prototype, "speed", void 0);
class AcceptAssignmentDto {
}
exports.AcceptAssignmentDto = AcceptAssignmentDto;
//# sourceMappingURL=unit.dto.js.map