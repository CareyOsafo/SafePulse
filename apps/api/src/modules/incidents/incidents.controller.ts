import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  Headers,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { IncidentsService } from './incidents.service';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../auth/auth.service';
import { CreateIncidentDto, UpdateLocationDto } from './dto/incident.dto';
import { Throttle } from '@nestjs/throttler';

@ApiTags('incidents')
@ApiBearerAuth()
@Controller('incidents')
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  @Post()
  @Throttle({ short: { ttl: 60000, limit: 5 } }) // Max 5 incidents per minute
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new emergency incident' })
  @ApiResponse({ status: 201, description: 'Incident created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  @ApiResponse({ status: 403, description: 'KYC verification failed' })
  @ApiResponse({ status: 429, description: 'Rate limit exceeded' })
  async createIncident(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateIncidentDto,
    @Headers('x-idempotency-key') idempotencyKey?: string,
  ) {
    return this.incidentsService.createIncident(user, dto, idempotencyKey);
  }

  @Post(':id/location')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update incident location (live tracking)' })
  @ApiResponse({ status: 200, description: 'Location updated' })
  @ApiResponse({ status: 404, description: 'Incident not found' })
  async updateLocation(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') incidentId: string,
    @Body() dto: UpdateLocationDto,
  ) {
    return this.incidentsService.updateLocation(user, incidentId, dto);
  }

  @Post(':id/cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel an active incident' })
  @ApiResponse({ status: 200, description: 'Incident cancelled' })
  @ApiResponse({ status: 404, description: 'Incident not found' })
  @ApiResponse({ status: 400, description: 'Incident cannot be cancelled' })
  async cancelIncident(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') incidentId: string,
  ) {
    return this.incidentsService.cancelIncident(user, incidentId);
  }

  @Post(':id/mark-safe')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark caller as safe' })
  @ApiResponse({ status: 200, description: 'Marked as safe' })
  @ApiResponse({ status: 404, description: 'Incident not found' })
  async markSafe(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') incidentId: string,
  ) {
    return this.incidentsService.markSafe(user, incidentId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get incident details' })
  @ApiResponse({ status: 200, description: 'Incident details' })
  @ApiResponse({ status: 404, description: 'Incident not found' })
  async getIncident(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') incidentId: string,
  ) {
    return this.incidentsService.getIncidentForUser(user, incidentId);
  }

  @Get()
  @ApiOperation({ summary: 'Get user incident history' })
  @ApiResponse({ status: 200, description: 'List of incidents' })
  async getUserIncidents(@CurrentUser() user: AuthenticatedUser) {
    return this.incidentsService.getUserIncidents(user.id);
  }
}
