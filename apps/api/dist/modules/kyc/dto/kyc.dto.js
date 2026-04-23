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
exports.StartKycDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const shared_1 = require("@safepulse/shared");
class StartKycDto {
}
exports.StartKycDto = StartKycDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Ghana Card number',
        example: 'GHA-123456789-0',
        pattern: 'GHA-[0-9]{9}-[0-9]',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(shared_1.Validation.ghanaCardRegex, {
        message: 'Invalid Ghana Card number format. Expected: GHA-XXXXXXXXX-X',
    }),
    __metadata("design:type", String)
], StartKycDto.prototype, "ghanaCardNumber", void 0);
//# sourceMappingURL=kyc.dto.js.map