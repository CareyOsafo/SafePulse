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
exports.UpdateLocationDto = exports.CreateIncidentDto = exports.LocationBundleDto = exports.CoordinatesDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const shared_1 = require("@safepulse/shared");
class CoordinatesDto {
}
exports.CoordinatesDto = CoordinatesDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Latitude', example: 5.6037 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(-90),
    (0, class_validator_1.Max)(90),
    __metadata("design:type", Number)
], CoordinatesDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Longitude', example: -0.1870 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(-180),
    (0, class_validator_1.Max)(180),
    __metadata("design:type", Number)
], CoordinatesDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Accuracy in meters', example: 10 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CoordinatesDto.prototype, "accuracy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Altitude in meters' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CoordinatesDto.prototype, "altitude", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Heading in degrees (0-360)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(360),
    __metadata("design:type", Number)
], CoordinatesDto.prototype, "heading", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Speed in m/s' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CoordinatesDto.prototype, "speed", void 0);
class LocationBundleDto {
}
exports.LocationBundleDto = LocationBundleDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: CoordinatesDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => CoordinatesDto),
    __metadata("design:type", CoordinatesDto)
], LocationBundleDto.prototype, "coordinates", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: shared_1.LocationSource, example: shared_1.LocationSource.GPS }),
    (0, class_validator_1.IsEnum)(shared_1.LocationSource),
    __metadata("design:type", String)
], LocationBundleDto.prototype, "source", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: shared_1.LocationConfidence }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(shared_1.LocationConfidence),
    __metadata("design:type", String)
], LocationBundleDto.prototype, "confidence", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ISO timestamp when location was captured' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LocationBundleDto.prototype, "timestamp", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Landmark description for manual locations' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LocationBundleDto.prototype, "landmark", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Saved place ID (home/work)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LocationBundleDto.prototype, "savedPlaceId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Saved place name' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LocationBundleDto.prototype, "savedPlaceName", void 0);
class CreateIncidentDto {
}
exports.CreateIncidentDto = CreateIncidentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: shared_1.EmergencyType,
        description: 'Type of emergency',
        example: shared_1.EmergencyType.MEDICAL,
    }),
    (0, class_validator_1.IsEnum)(shared_1.EmergencyType),
    __metadata("design:type", String)
], CreateIncidentDto.prototype, "emergencyType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: LocationBundleDto, description: 'Location information' }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => LocationBundleDto),
    __metadata("design:type", LocationBundleDto)
], CreateIncidentDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: shared_1.IncidentPriority,
        description: 'Priority level',
        example: shared_1.IncidentPriority.NORMAL,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(shared_1.IncidentPriority),
    __metadata("design:type", String)
], CreateIncidentDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional description' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateIncidentDto.prototype, "description", void 0);
class UpdateLocationDto {
}
exports.UpdateLocationDto = UpdateLocationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: CoordinatesDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => CoordinatesDto),
    __metadata("design:type", CoordinatesDto)
], UpdateLocationDto.prototype, "coordinates", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: shared_1.LocationSource }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(shared_1.LocationSource),
    __metadata("design:type", String)
], UpdateLocationDto.prototype, "source", void 0);
//# sourceMappingURL=incident.dto.js.map