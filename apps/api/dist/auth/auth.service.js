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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jose = require("jose");
const database_service_1 = require("../database/database.service");
let AuthService = class AuthService {
    constructor(configService, db) {
        this.configService = configService;
        this.db = db;
        this.jwks = null;
        this.supabaseProjectRef = this.configService.get('SUPABASE_PROJECT_REF') || '';
    }
    async onModuleInit() {
        await this.initializeJwks();
    }
    async initializeJwks() {
        const supabaseUrl = this.configService.get('SUPABASE_URL');
        if (!supabaseUrl) {
            console.warn('SUPABASE_URL not configured, JWT verification will fail');
            return;
        }
        const jwksUrl = `${supabaseUrl}/auth/v1/.well-known/jwks.json`;
        this.jwks = jose.createRemoteJWKSet(new URL(jwksUrl));
    }
    async verifyToken(token) {
        if (!this.jwks) {
            throw new common_1.UnauthorizedException('JWT verification not configured');
        }
        try {
            const { payload } = await jose.jwtVerify(token, this.jwks, {
                audience: 'authenticated',
                issuer: `https://${this.supabaseProjectRef}.supabase.co/auth/v1`,
            });
            return payload;
        }
        catch (error) {
            if (error instanceof jose.errors.JWTExpired) {
                throw new common_1.UnauthorizedException('Token expired');
            }
            throw new common_1.UnauthorizedException('Invalid token');
        }
    }
    async getAuthenticatedUser(supabaseUid) {
        const user = await this.db.queryOne(`SELECT
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
      WHERE u.supabase_uid = $1`, [supabaseUid]);
        if (!user) {
            return null;
        }
        if (user.app_role === 'citizen' && user.email) {
            const preProvisioned = await this.db.queryOne(`SELECT
          u.id, u.phone_number, u.email, u.full_name, u.app_role,
          (SELECT au.agency_id FROM agency_users au WHERE au.user_id = u.id AND au.is_active = true LIMIT 1) as agency_id,
          (SELECT un.id FROM units un WHERE un.assigned_user_id = u.id LIMIT 1) as unit_id
        FROM users u
        WHERE u.email = $1 AND u.id != $2 AND u.app_role != 'citizen'`, [user.email, user.id]);
            if (preProvisioned) {
                await this.db.mutateOne(`DELETE FROM users WHERE id = $1 RETURNING id`, [user.id]);
                await this.db.mutateOne(`UPDATE users SET supabase_uid = $1, updated_at = NOW() WHERE id = $2 RETURNING id`, [supabaseUid, preProvisioned.id]);
                return {
                    id: preProvisioned.id,
                    supabaseUid: supabaseUid,
                    phoneNumber: preProvisioned.phone_number,
                    email: preProvisioned.email,
                    fullName: preProvisioned.full_name,
                    appRole: preProvisioned.app_role,
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
            appRole: user.app_role,
            agencyId: user.agency_id,
            unitId: user.unit_id,
        };
    }
    async autoProvisionUser(payload) {
        if (payload.email) {
            const existing = await this.db.queryOne(`SELECT id, supabase_uid, phone_number, email, full_name, app_role,
                (SELECT au.agency_id FROM agency_users au WHERE au.user_id = users.id AND au.is_active = true LIMIT 1) as agency_id,
                (SELECT un.id FROM units un WHERE un.assigned_user_id = users.id LIMIT 1) as unit_id
         FROM users
         WHERE email = $1 AND supabase_uid != $2`, [payload.email, payload.sub]);
            if (existing) {
                await this.db.mutateOne(`UPDATE users SET supabase_uid = $1, updated_at = NOW() WHERE id = $2 RETURNING id`, [payload.sub, existing.id]);
                return {
                    id: existing.id,
                    supabaseUid: payload.sub,
                    phoneNumber: existing.phone_number,
                    email: existing.email,
                    fullName: existing.full_name,
                    appRole: existing.app_role,
                    agencyId: existing.agency_id,
                    unitId: existing.unit_id,
                };
            }
        }
        const user = await this.db.mutateOne(`INSERT INTO users (supabase_uid, email, phone_number, app_role)
      VALUES ($1, $2, $3, 'dispatcher')
      ON CONFLICT (supabase_uid)
      DO UPDATE SET
        email = COALESCE(EXCLUDED.email, users.email),
        updated_at = NOW()
      RETURNING id, supabase_uid, email, phone_number, full_name, app_role`, [payload.sub, payload.email || null, payload.phone || null]);
        return {
            id: user.id,
            supabaseUid: user.supabase_uid,
            phoneNumber: user.phone_number,
            email: user.email,
            fullName: user.full_name,
            appRole: user.app_role,
        };
    }
    async createOrUpdateUser(supabaseUid, phoneNumber, fullName, email) {
        if (email) {
            const existing = await this.db.queryOne(`SELECT id, supabase_uid, phone_number, email, full_name, app_role,
                (SELECT au.agency_id FROM agency_users au WHERE au.user_id = users.id AND au.is_active = true LIMIT 1) as agency_id,
                (SELECT un.id FROM units un WHERE un.assigned_user_id = users.id LIMIT 1) as unit_id
         FROM users
         WHERE email = $1 AND supabase_uid != $2`, [email, supabaseUid]);
            if (existing) {
                await this.db.mutateOne(`UPDATE users SET supabase_uid = $1, updated_at = NOW() WHERE id = $2 RETURNING id`, [supabaseUid, existing.id]);
                return {
                    id: existing.id,
                    supabaseUid: supabaseUid,
                    phoneNumber: existing.phone_number,
                    email: existing.email,
                    fullName: existing.full_name,
                    appRole: existing.app_role,
                    agencyId: existing.agency_id,
                    unitId: existing.unit_id,
                };
            }
        }
        const user = await this.db.mutateOne(`INSERT INTO users (supabase_uid, phone_number, email, full_name, app_role)
      VALUES ($1, $2, $3, $4, 'citizen')
      ON CONFLICT (supabase_uid)
      DO UPDATE SET
        phone_number = COALESCE(EXCLUDED.phone_number, users.phone_number),
        email = COALESCE(EXCLUDED.email, users.email),
        full_name = COALESCE(EXCLUDED.full_name, users.full_name),
        updated_at = NOW()
      RETURNING id, supabase_uid, phone_number, email, full_name, app_role`, [supabaseUid, phoneNumber || null, email || null, fullName]);
        return {
            id: user.id,
            supabaseUid: user.supabase_uid,
            phoneNumber: user.phone_number,
            email: user.email,
            fullName: user.full_name,
            appRole: user.app_role,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        database_service_1.DatabaseService])
], AuthService);
//# sourceMappingURL=auth.service.js.map