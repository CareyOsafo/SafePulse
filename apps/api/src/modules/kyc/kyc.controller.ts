import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  Headers,
  RawBodyRequest,
  Req,
  Query,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiHeader, ApiQuery } from '@nestjs/swagger';
import { Request } from 'express';
import { KycService } from './kyc.service';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { Public } from '../../auth/decorators/public.decorator';
import { AuthenticatedUser } from '../../auth/auth.service';
import { StartKycDto } from './dto/kyc.dto';

@ApiTags('kyc')
@Controller('kyc')
export class KycController {
  constructor(
    private readonly kycService: KycService,
    private readonly configService: ConfigService,
  ) {}

  @Post('start')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Start KYC verification with Ghana Card' })
  @ApiResponse({ status: 200, description: 'Verification started, returns verification URL' })
  @ApiResponse({ status: 400, description: 'Invalid Ghana Card number or already verified' })
  @ApiResponse({ status: 409, description: 'Ghana Card already registered' })
  async startKyc(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: StartKycDto,
  ) {
    return this.kycService.startVerification(user.id, dto);
  }

  @Get('status')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current KYC status' })
  @ApiResponse({ status: 200, description: 'KYC status' })
  async getStatus(@CurrentUser() user: AuthenticatedUser) {
    return this.kycService.getStatus(user.id);
  }

  @Post('retry')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retry KYC verification after failure' })
  @ApiResponse({ status: 200, description: 'Retry initiated' })
  @ApiResponse({ status: 400, description: 'Cannot retry at this time' })
  async retryKyc(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: StartKycDto,
  ) {
    return this.kycService.retryVerification(user.id, dto);
  }

  @Post('/webhooks/metamap')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'MetaMap webhook receiver' })
  @ApiHeader({ name: 'x-metamap-signature', description: 'Webhook signature' })
  @ApiResponse({ status: 200, description: 'Webhook processed' })
  async handleMetaMapWebhook(
    @Headers('x-metamap-signature') signature: string,
    @Body() body: any,
    @Req() req: RawBodyRequest<Request>,
  ) {
    return this.kycService.handleWebhook(signature, body, req.rawBody);
  }

  // ============================================================
  // DEVELOPMENT ONLY - Test endpoint (disabled in production)
  // ============================================================
  @Post('test')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '[DEV ONLY] Test KYC verification without auth' })
  @ApiQuery({ name: 'userId', required: true, description: 'User ID to verify' })
  @ApiResponse({ status: 200, description: 'Verification result' })
  @ApiResponse({ status: 403, description: 'Only available in development' })
  async testKyc(
    @Query('userId') userId: string,
    @Body() dto: StartKycDto,
  ) {
    if (this.configService.get<string>('NODE_ENV') === 'production') {
      throw new ForbiddenException('Test endpoint not available in production');
    }

    return this.kycService.startVerification(userId, dto);
  }

  @Get('test/status')
  @Public()
  @ApiOperation({ summary: '[DEV ONLY] Get KYC status without auth' })
  @ApiQuery({ name: 'userId', required: true, description: 'User ID to check' })
  @ApiResponse({ status: 200, description: 'KYC status' })
  @ApiResponse({ status: 403, description: 'Only available in development' })
  async testGetStatus(@Query('userId') userId: string) {
    if (this.configService.get<string>('NODE_ENV') === 'production') {
      throw new ForbiddenException('Test endpoint not available in production');
    }

    return this.kycService.getStatus(userId);
  }
}
