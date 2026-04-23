import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UssdAuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const sharedSecret = this.configService.get<string>('USSD_SHARED_SECRET');

    if (!sharedSecret) {
      // If no secret configured, allow in development
      if (this.configService.get<string>('NODE_ENV') === 'development') {
        return true;
      }
      throw new UnauthorizedException('USSD authentication not configured');
    }

    const providedSecret = request.headers['x-ussd-secret'] || request.headers['authorization'];

    if (!providedSecret || providedSecret !== sharedSecret) {
      throw new UnauthorizedException('Invalid USSD authentication');
    }

    return true;
  }
}
