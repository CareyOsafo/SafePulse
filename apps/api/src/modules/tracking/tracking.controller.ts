import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TrackingService } from './tracking.service';
import { Public } from '../../auth/decorators/public.decorator';

@ApiTags('tracking')
@Controller('t')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Get(':token')
  @Public()
  @ApiOperation({ summary: 'Get incident status by tracking token (public)' })
  @ApiResponse({ status: 200, description: 'Incident tracking info' })
  @ApiResponse({ status: 404, description: 'Invalid or expired tracking token' })
  async getTrackingInfo(@Param('token') token: string) {
    const info = await this.trackingService.getTrackingInfo(token);

    if (!info) {
      throw new NotFoundException('Invalid or expired tracking link');
    }

    return info;
  }
}
