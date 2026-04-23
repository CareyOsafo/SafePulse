import { Injectable, UnauthorizedException, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jose from 'jose';
import { DatabaseService } from '../database/database.service';
import { AppRole } from '@safepulse/shared';

export interface JwtPayload {
  sub: string;
  aud: string;
  exp: number;
  iat: number;
  iss: string;
  phone?: string;
  email?: string;
  role?: string;
}

export interface AuthenticatedUser {
  id: string;
  supabaseUid: string;
  phoneNumber: string | null;
  email: string | null;
  fullName: string | null;
  appRole: AppRole;
  agencyId?: string;
  unitId?: string;
}

@Injectable()
export class AuthService implements OnModuleInit {
  private jwks: jose.JWTVerifyGetKey | null = null;
  private supabaseProjectRef: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly db: DatabaseService,
  ) {
    this.supabaseProjectRef = this.configService.get<string>('SUPABASE_PROJECT_REF') || '';
  }

  async onModuleInit() {
    await this.initializeJwks();
  }

  private async initializeJwks() {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    if (!supabaseUrl) {
      console.warn('SUPABASE_URL not configured, JWT verification will fail');
      return;
    }

    const jwksUrl = `${supabaseUrl}/auth/v1/.well-known/jwks.json`;
    this.jwks = jose.createRemoteJWKSet(new URL(jwksUrl));
  }

  async verifyToken(token: string): Promise<JwtPayload> {
    if (!this.jwks) {
      throw new UnauthorizedException('JWT verification not configured');
    }

    try {
      const { payload } = await jose.jwtVerify(token, this.jwks, {
        audience: 'authenticated',
        issuer: `https://${this.supabaseProjectRef}.supabase.co/auth/v1`,
      });

      return payload as unknown as JwtPayload;
    } catch (error) {
      if (error instanceof jose.errors.JWTExpired) {
        throw new UnauthorizedException('Token expired');
      }
      throw new UnauthorizedException('Invalid token');
    }
  }

  async getAuthenticatedUser(supabaseUid: string): Promise<AuthenticatedUser | null> {
    // Get user with role from database
    const user = await this.db.queryOne<any>(
      `SELECT
        u.id,
        u.supabase_uid,
        u.phone_number,
        u.email,
        u.full_name,
        u.app_role,
        au.agency_id,
        un.id as unit_id
      FROM users u
      LEFT JOIN agency_users au ON u.id = au.user_id AND au.is_active = true
      LEFT JOIN units un ON un.assigned_user_id = u.id
      WHERE u.supabase_uid = $1`,
      [supabaseUid],
    );

    if (!user) {
      return null;
    }

    // If the user was auto-created as citizen, check if a pre-provisioned record
    // with the same email exists that has the intended role (e.g. unit, dispatcher).
    // If so, merge by linking the real Supabase UID to that record and removing
    // the auto-created duplicate.
    if (user.app_role === 'citizen' && user.email) {
      const preProvisioned = await this.db.queryOne<any>(
        `SELECT
          u.id, u.phone_number, u.email, u.full_name, u.app_role,
          (SELECT au.agency_id FROM agency_users au WHERE au.user_id = u.id AND au.is_active = true LIMIT 1) as agency_id,
          (SELECT un.id FROM units un WHERE un.assigned_user_id = u.id LIMIT 1) as unit_id
        FROM users u
        WHERE u.email = $1 AND u.id != $2 AND u.app_role != 'citizen'`,
        [user.email, user.id],
      );

      if (preProvisioned) {
        // Delete the auto-created citizen duplicate first (it holds the real supabase_uid)
        await this.db.mutateOne(
          `DELETE FROM users WHERE id = $1 RETURNING id`,
          [user.id],
        );
        // Now link the real Supabase UID to the pre-provisioned record
        await this.db.mutateOne(
          `UPDATE users SET supabase_uid = $1, updated_at = NOW() WHERE id = $2 RETURNING id`,
          [supabaseUid, preProvisioned.id],
        );

        return {
          id: preProvisioned.id,
          supabaseUid: supabaseUid,
          phoneNumber: preProvisioned.phone_number,
          email: preProvisioned.email,
          fullName: preProvisioned.full_name,
          appRole: preProvisioned.app_role as AppRole,
          agencyId: preProvisioned.agency_id,
          unitId: preProvisioned.unit_id,
        };
      }
    }

    return {
      id: user.id,
      supabaseUid: user.supabase_uid,
      phoneNumber: user.phone_number,
      email: user.email,
      fullName: user.full_name,
      appRole: user.app_role as AppRole,
      agencyId: user.agency_id,
      unitId: user.unit_id,
    };
  }

  async autoProvisionUser(payload: JwtPayload): Promise<AuthenticatedUser> {
    // Check for a pre-provisioned user by email first
    if (payload.email) {
      const existing = await this.db.queryOne<any>(
        `SELECT id, supabase_uid, phone_number, email, full_name, app_role,
                (SELECT au.agency_id FROM agency_users au WHERE au.user_id = users.id AND au.is_active = true LIMIT 1) as agency_id,
                (SELECT un.id FROM units un WHERE un.assigned_user_id = users.id LIMIT 1) as unit_id
         FROM users
         WHERE email = $1 AND supabase_uid != $2`,
        [payload.email, payload.sub],
      );

      if (existing) {
        await this.db.mutateOne(
          `UPDATE users SET supabase_uid = $1, updated_at = NOW() WHERE id = $2 RETURNING id`,
          [payload.sub, existing.id],
        );

        return {
          id: existing.id,
          supabaseUid: payload.sub,
          phoneNumber: existing.phone_number,
          email: existing.email,
          fullName: existing.full_name,
          appRole: existing.app_role as AppRole,
          agencyId: existing.agency_id,
          unitId: existing.unit_id,
        };
      }
    }

    const user = await this.db.mutateOne<any>(
      `INSERT INTO users (supabase_uid, email, phone_number, app_role)
      VALUES ($1, $2, $3, 'dispatcher')
      ON CONFLICT (supabase_uid)
      DO UPDATE SET
        email = COALESCE(EXCLUDED.email, users.email),
        updated_at = NOW()
      RETURNING id, supabase_uid, email, phone_number, full_name, app_role`,
      [payload.sub, payload.email || null, payload.phone || null],
    );

    return {
      id: user.id,
      supabaseUid: user.supabase_uid,
      phoneNumber: user.phone_number,
      email: user.email,
      fullName: user.full_name,
      appRole: user.app_role as AppRole,
    };
  }

  async createOrUpdateUser(
    supabaseUid: string,
    phoneNumber?: string,
    fullName?: string,
    email?: string,
  ): Promise<AuthenticatedUser> {
    // First, check if a pre-provisioned user with this email already exists
    // (e.g. created by an admin or seed data with a placeholder supabase_uid).
    // If found, link the real Supabase UID to that record so their role is preserved.
    if (email) {
      const existing = await this.db.queryOne<any>(
        `SELECT id, supabase_uid, phone_number, email, full_name, app_role,
                (SELECT au.agency_id FROM agency_users au WHERE au.user_id = users.id AND au.is_active = true LIMIT 1) as agency_id,
                (SELECT un.id FROM units un WHERE un.assigned_user_id = users.id LIMIT 1) as unit_id
         FROM users
         WHERE email = $1 AND supabase_uid != $2`,
        [email, supabaseUid],
      );

      if (existing) {
        // Link the real Supabase UID to the pre-provisioned record
        await this.db.mutateOne(
          `UPDATE users SET supabase_uid = $1, updated_at = NOW() WHERE id = $2 RETURNING id`,
          [supabaseUid, existing.id],
        );

        return {
          id: existing.id,
          supabaseUid: supabaseUid,
          phoneNumber: existing.phone_number,
          email: existing.email,
          fullName: existing.full_name,
          appRole: existing.app_role as AppRole,
          agencyId: existing.agency_id,
          unitId: existing.unit_id,
        };
      }
    }

    const user = await this.db.mutateOne<any>(
      `INSERT INTO users (supabase_uid, phone_number, email, full_name, app_role)
      VALUES ($1, $2, $3, $4, 'citizen')
      ON CONFLICT (supabase_uid)
      DO UPDATE SET
        phone_number = COALESCE(EXCLUDED.phone_number, users.phone_number),
        email = COALESCE(EXCLUDED.email, users.email),
        full_name = COALESCE(EXCLUDED.full_name, users.full_name),
        updated_at = NOW()
      RETURNING id, supabase_uid, phone_number, email, full_name, app_role`,
      [supabaseUid, phoneNumber || null, email || null, fullName],
    );

    return {
      id: user.id,
      supabaseUid: user.supabase_uid,
      phoneNumber: user.phone_number,
      email: user.email,
      fullName: user.full_name,
      appRole: user.app_role as AppRole,
    };
  }
}
