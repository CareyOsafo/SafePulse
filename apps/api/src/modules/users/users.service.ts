import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { UpdateProfileDto, UpdateSavedPlaceDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly db: DatabaseService) {}

  async getUserProfile(userId: string) {
    const user = await this.db.queryOne(
      `SELECT * FROM users WHERE id = $1`,
      [userId],
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.formatUserProfile(user);
  }

  async getUserById(userId: string) {
    return this.db.queryOne(`SELECT * FROM users WHERE id = $1`, [userId]);
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const fields: string[] = [];
    const values: any[] = [];
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

    const user = await this.db.mutateOne(
      `UPDATE users SET ${fields.join(', ')}
       WHERE id = $${paramIndex}
       RETURNING *`,
      values,
    );

    return this.formatUserProfile(user);
  }

  async updateDeviceToken(userId: string, token: string, platform: string) {
    await this.db.query(
      `UPDATE users SET device_token = $1, device_platform = $2, updated_at = NOW()
       WHERE id = $3`,
      [token, platform, userId],
    );

    return { success: true };
  }

  async updateSavedPlace(userId: string, type: 'home' | 'work', dto: UpdateSavedPlaceDto) {
    const prefix = type === 'home' ? 'home' : 'work';

    await this.db.query(
      `UPDATE users SET
        ${prefix}_latitude = $1,
        ${prefix}_longitude = $2,
        ${prefix}_address = $3,
        updated_at = NOW()
       WHERE id = $4`,
      [dto.latitude, dto.longitude, dto.address, userId],
    );

    return { success: true };
  }

  async getSavedPlaces(userId: string) {
    const user = await this.db.queryOne(
      `SELECT home_latitude, home_longitude, home_address,
              work_latitude, work_longitude, work_address
       FROM users WHERE id = $1`,
      [userId],
    );

    if (!user) {
      throw new NotFoundException('User not found');
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

  async updateLastActive(userId: string) {
    await this.db.query(
      `UPDATE users SET last_active_at = NOW() WHERE id = $1`,
      [userId],
    );
  }

  private formatUserProfile(user: any) {
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
}
