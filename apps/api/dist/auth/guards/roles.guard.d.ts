import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../../database/database.service';
export declare class RolesGuard implements CanActivate {
    private reflector;
    private configService;
    private db;
    constructor(reflector: Reflector, configService: ConfigService, db: DatabaseService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private devProvisionUser;
    private reloadUser;
}
