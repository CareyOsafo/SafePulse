import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { UssdService } from './ussd.service';
import { Public } from '../../auth/decorators/public.decorator';
import { UssdAuthGuard } from '../../auth/guards/ussd-auth.guard';
import { UssdRequestDto } from './dto/ussd.dto';
import { Throttle } from '@nestjs/throttler';

@ApiTags('ussd')
@Controller('ussd')
export class UssdController {
  constructor(private readonly ussdService: UssdService) {}

  @Post('session')
  @Public()
  @UseGuards(UssdAuthGuard)
  @Throttle({ short: { ttl: 1000, limit: 10 } })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Handle USSD session request from telco aggregator' })
  @ApiHeader({ name: 'x-ussd-secret', description: 'USSD webhook shared secret' })
  @ApiResponse({ status: 200, description: 'USSD response' })
  @ApiResponse({ status: 401, description: 'Invalid authentication' })
  async handleSession(@Body() dto: UssdRequestDto) {
    return this.ussdService.handleSession(dto);
  }
}
