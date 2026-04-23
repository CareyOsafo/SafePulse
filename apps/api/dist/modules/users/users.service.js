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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../../database/database.service");
let UsersService = class UsersService {
    constructor(db) {
        this.db = db;
    }
    async getUserProfile(userId) {
        const user = await this.db.queryOne(`SELECT * FROM users WHERE id = $1`, [userId]);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return this.formatUserProfile(user);
    }
    async getUserById(userId) {
        return this.db.queryOne(`SELECT * FROM users WHERE id = $1`, [userId]);
    }
    async updateProfile(userId, dto) {
        const fields = [];
        const values = [];
        let paramIndex = 1;
        if (dto.fullName !== undefined) {
            fields.push(`full_name = $${paramIndex++}`);
            values.push(dto.fullName);
        }
        if (dto.profilePhotoUrl !== undefined) {
            fields.push(`profile_photo_url = $${paramIndex++}`);
            values.push(dto.profilePhotoUrl);
        }
        if (fields.length === 0) {
            return this.getUserProfile(userId);
        }
        fields.push(`updated_at = NOW()`);
        values.push(userId);
        const user = await this.db.mutateOne(`UPDATE users SET ${fields.join(', ')}
       WHERE id = $${paramIndex}
       RETURNING *`, values);
        return this.formatUserProfile(user);
    }
    async updateDeviceToken(userId, token, platform) {
        await this.db.query(`UPDATE users SET device_token = $1, device_platform = $2, updated_at = NOW()
       WHERE id = $3`, [token, platform, userId]);
        return { success: true };
    }
    async updateSavedPlace(userId, type, dto) {
        const prefix = type === 'home' ? 'home' : 'work';
        await this.db.query(`UPDATE users SET
        ${prefix}_latitude = $1,
        ${prefix}_longitude = $2,
        ${prefix}_address = $3,
        updated_at = NOW()
       WHERE id = $4`, [dto.latitude, dto.longitude, dto.address, userId]);
        return { success: true };
    }
    async getSavedPlaces(userId) {
        const user = await this.db.queryOne(`SELECT home_latitude, home_longitude, home_address,
              work_latitude, work_longitude, work_address
       FROM users WHERE id = $1`, [userId]);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return {
            home: user.home_latitude
                ? {
                    latitude: parseFloat(user.home_latitude),
                    longitude: parseFloat(user.home_longitude),
                    address: user.home_address,
                }
                : null,
            work: user.work_latitude
                ? {
                    latitude: parseFloat(user.work_latitude),
                    longitude: parseFloat(user.work_longitude),
                    address: user.work_address,
                }
                : null,
        };
    }
    async updateLastActive(userId) {
        await this.db.query(`UPDATE users SET last_active_at = NOW() WHERE id = $1`, [userId]);
    }
    formatUserProfile(user) {
        return {
            id: user.id,
            phoneNumber: user.phone_number,
            fullName: user.full_name,
            profilePhotoUrl: user.profile_photo_url,
            appRole: user.app_role,
            kycStatus: user.kyc_status,
            ghanaCardLast4: user.ghana_card_last4,
            savedPlaces: {
                home: user.home_latitude
                    ? {
                        latitude: parseFloat(user.home_latitude),
                        longitude: parseFloat(user.home_longitude),
                        address: user.home_address,
                    }
                    : null,
                work: user.work_latitude
                    ? {
                        latitude: parseFloat(user.work_latitude),
                        longitude: parseFloat(user.work_longitude),
                        address: user.work_address,
                    }
                    : null,
            },
            createdAt: user.created_at,
            updatedAt: user.updated_at,
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], UsersService);
//# sourceMappingURL=users.service.js.map