import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { AppRole } from '@safepulse/shared';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private configService: ConfigService,
    private db: DatabaseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<AppRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const { user } = request;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    const hasRole = requiredRoles.some((role) => user.appRole === role);
    const isDev = this.configService.get<string>('NODE_ENV') === 'development';

    if (!hasRole) {
      if (!isDev) {
        throw new ForbiddenException(
          `Insufficient permissions. Required roles: ${requiredRoles.join(', ')}`,
        );
      }
      // Dev mode: auto-provision the user with the required role
      const targetRole = requiredRoles[0];
      await this.devProvisionUser(user, targetRole);
      request.user = { ...user, ...await this.reloadUser(user.id) };
      return true;
    }

    // User has the right role but may be missing agency/unit links
    // (e.g. role was set via email matching but agency_users record is missing).
    // In dev mode, patch the missing associations so all endpoints work.
    const needsAgency = !user.agencyId &&
      [AppRole.DISPATCHER, AppRole.SUPERVISOR, AppRole.ADMIN, AppRole.UNIT].includes(user.appRole);
    const needsUnit = !user.unitId && user.appRole === AppRole.UNIT;

    if (isDev && (needsAgency || needsUnit)) {
      await this.devProvisionUser(user, user.appRole);
      request.user = { ...user, ...await this.reloadUser(user.id) };
    }

    return true;
  }

  /**
   * Development-only: upgrade a user's role and create the necessary
   * agency/unit associations so every portal is immediately testable.
   */
  private async devProvisionUser(user: any, targetRole: AppRole) {
    // Update the user's app_role
    await this.db.query(
      `UPDATE users SET app_role = $1, updated_at = NOW() WHERE id = $2`,
      [targetRole, user.id],
    );

    // Ensure the user is linked to an agency
    if (!user.agencyId) {
      const agency = await this.db.queryOne<any>(
        `SELECT id FROM agencies WHERE is_active = true ORDER BY created_at LIMIT 1`,
      );
      if (agency) {
        const agencyRole = targetRole === AppRole.UNIT ? 'dispatcher' : targetRole;
        await this.db.query(
          `INSERT INTO agency_users (agency_id, user_id, role)
           VALUES ($1, $2, $3)
           ON CONFLICT (agency_id, user_id) DO NOTHING`,
          [agency.id, user.id, agencyRole],
        );
      }
    }

    // For unit role, ensure the user is assigned to a unit
    if (targetRole === AppRole.UNIT && !user.unitId) {
      await this.db.query(
        `UPDATE units SET assigned_user_id = $1
         WHERE id = (
           SELECT id FROM units
           WHERE assigned_user_id IS NULL AND status = 'available'
           ORDER BY created_at LIMIT 1
         )
         AND assigned_user_id IS NULL`,
        [user.id],
      );
    }

    console.log(
      `[DEV] Auto-provisioned user ${user.email || user.id} as ${targetRole}`,
    );
  }

  private async reloadUser(userId: string) {
    const user = await this.db.queryOne<any>(
      `SELECT
        u.id,
        u.supabase_uid,
        u.phone_number,
        u.email,
        u.full_name,
        u.app_role,
        (SELECT au.agency_id FROM agency_users au WHERE au.user_id = u.id AND au.is_active = true LIMIT 1) as agency_id,
        (SELECT un.id FROM units un WHERE un.assigned_user_id = u.id LIMIT 1) as unit_id
      FROM users u WHERE u.id = $1`,
      [userId],
    );

    if (!user) return {};

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
}
