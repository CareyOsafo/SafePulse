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
exports.RolesGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const roles_decorator_1 = require("../decorators/roles.decorator");
const shared_1 = require("@safepulse/shared");
const database_service_1 = require("../../database/database.service");
let RolesGuard = class RolesGuard {
    constructor(reflector, configService, db) {
        this.reflector = reflector;
        this.configService = configService;
        this.db = db;
    }
    async canActivate(context) {
        const requiredRoles = this.reflector.getAllAndOverride(roles_decorator_1.ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const { user } = request;
        if (!user) {
            throw new common_1.ForbiddenException('User not authenticated');
        }
        const hasRole = requiredRoles.some((role) => user.appRole === role);
        const isDev = this.configService.get('NODE_ENV') === 'development';
        if (!hasRole) {
            if (!isDev) {
                throw new common_1.ForbiddenException(`Insufficient permissions. Required roles: ${requiredRoles.join(', ')}`);
            }
            const targetRole = requiredRoles[0];
            await this.devProvisionUser(user, targetRole);
            request.user = { ...user, ...await this.reloadUser(user.id) };
            return true;
        }
        const needsAgency = !user.agencyId &&
            [shared_1.AppRole.DISPATCHER, shared_1.AppRole.SUPERVISOR, shared_1.AppRole.ADMIN, shared_1.AppRole.UNIT].includes(user.appRole);
        const needsUnit = !user.unitId && user.appRole === shared_1.AppRole.UNIT;
        if (isDev && (needsAgency || needsUnit)) {
            await this.devProvisionUser(user, user.appRole);
            request.user = { ...user, ...await this.reloadUser(user.id) };
        }
        return true;
    }
    async devProvisionUser(user, targetRole) {
        await this.db.query(`UPDATE users SET app_role = $1, updated_at = NOW() WHERE id = $2`, [targetRole, user.id]);
        if (!user.agencyId) {
            const agency = await this.db.queryOne(`SELECT id FROM agencies WHERE is_active = true ORDER BY created_at LIMIT 1`);
            if (agency) {
                const agencyRole = targetRole === shared_1.AppRole.UNIT ? 'dispatcher' : targetRole;
                await this.db.query(`INSERT INTO agency_users (agency_id, user_id, role)
           VALUES ($1, $2, $3)
           ON CONFLICT (agency_id, user_id) DO NOTHING`, [agency.id, user.id, agencyRole]);
            }
        }
        if (targetRole === shared_1.AppRole.UNIT && !user.unitId) {
            await this.db.query(`UPDATE units SET assigned_user_id = $1
         WHERE id = (
           SELECT id FROM units
           WHERE assigned_user_id IS NULL AND status = 'available'
           ORDER BY created_at LIMIT 1
         )
         AND assigned_user_id IS NULL`, [user.id]);
        }
        console.log(`[DEV] Auto-provisioned user ${user.email || user.id} as ${targetRole}`);
    }
    async reloadUser(userId) {
        const user = await this.db.queryOne(`SELECT
        u.id,
        u.supabase_uid,
        u.phone_number,
        u.email,
        u.full_name,
        u.app_role,
        (SELECT au.agency_id FROM agency_users au WHERE au.user_id = u.id AND au.is_active = true LIMIT 1) as agency_id,
        (SELECT un.id FROM units un WHERE un.assigned_user_id = u.id LIMIT 1) as unit_id
      FROM users u WHERE u.id = $1`, [userId]);
        if (!user)
            return {};
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
};
exports.RolesGuard = RolesGuard;
exports.RolesGuard = RolesGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        config_1.ConfigService,
        database_service_1.DatabaseService])
], RolesGuard);
//# sourceMappingURL=roles.guard.js.map