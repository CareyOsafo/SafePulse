import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { DispatcherService } from './dispatcher.service';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { AuthenticatedUser } from '../../auth/auth.service';
import { AppRole, EmergencyType, IncidentStatus, IncidentPriority } from '@safepulse/shared';
import {
  AcknowledgeIncidentDto,
  UpdateIncidentStatusDto,
  AddNotesDto,
  AssignUnitDto,
  SendMessageDto,
  IncidentFiltersDto,
} from './dto/dispatcher.dto';

@ApiTags('dispatcher')
@ApiBearerAuth()
@Controller('dispatcher')
@Roles(AppRole.DISPATCHER, AppRole.SUPERVISOR, AppRole.ADMIN)
export class DispatcherController {
  constructor(private readonly dispatcherService: DispatcherService) {}

  @Get('incidents')
  @ApiOperation({ summary: 'Get incidents for dispatcher queue' })
  @ApiQuery({ name: 'status', enum: IncidentStatus, isArray: true, required: false })
  @ApiQuery({ name: 'type', enum: EmergencyType, isArray: true, required: false })
  @ApiQuery({ name: 'priority', enum: IncidentPriority, isArray: true, required: false })
  @ApiQuery({ name: 'region', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'offset', required: false })
  @ApiResponse({ status: 200, description: 'List of incidents' })
  async getIncidents(
    @CurrentUser() user: AuthenticatedUser,
    @Query() filters: IncidentFiltersDto,
  ) {
    if (!user.agencyId) {
      throw new ForbiddenException('User is not linked to an agency');
    }
    return this.dispatcherService.getIncidents(user.agencyId, filters);
  }

  @Get('incidents/:id')
  @ApiOperation({ summary: 'Get incident details' })
  @ApiResponse({ status: 200, description: 'Incident details with timeline and assignments' })
  async getIncidentDetails(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') incidentId: string,
  ) {
    if (!user.agencyId) {
      throw new ForbiddenException('User is not linked to an agency');
    }
    return this.dispatcherService.getIncidentDetails(user.agencyId, incidentId);
  }

  @Post('incidents/:id/acknowledge')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Acknowledge an incident' })
  @ApiResponse({ status: 200, description: 'Incident acknowledged' })
  async acknowledgeIncident(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') incidentId: string,
    @Body() dto: AcknowledgeIncidentDto,
  ) {
    return this.dispatcherService.acknowledgeIncident(user, incidentId, dto);
  }

  @Post('incidents/:id/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update incident status' })
  @ApiResponse({ status: 200, description: 'Status updated' })
  async updateIncidentStatus(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') incidentId: string,
    @Body() dto: UpdateIncidentStatusDto,
  ) {
    return this.dispatcherService.updateIncidentStatus(user, incidentId, dto);
  }

  @Post('incidents/:id/notes')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Add dispatcher notes' })
  @ApiResponse({ status: 200, description: 'Notes added' })
  async addNotes(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') incidentId: string,
    @Body() dto: AddNotesDto,
  ) {
    return this.dispatcherService.addNotes(user, incidentId, dto.notes);
  }

  @Post('incidents/:id/assign')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Assign a unit to incident' })
  @ApiResponse({ status: 200, description: 'Unit assigned' })
  async assignUnit(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') incidentId: string,
    @Body() dto: AssignUnitDto,
  ) {
    if (!user.agencyId) {
      throw new ForbiddenException('User is not linked to an agency');
    }
    return this.dispatcherService.assignUnit(user, incidentId, dto);
  }

  @Post('incidents/:id/message')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send message to caller or contact' })
  @ApiResponse({ status: 200, description: 'Message sent' })
  async sendMessage(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') incidentId: string,
    @Body() dto: SendMessageDto,
  ) {
    return this.dispatcherService.sendMessage(user, incidentId, dto);
  }

  @Get('incidents/:id/timeline')
  @ApiOperation({ summary: 'Get incident event timeline' })
  @ApiResponse({ status: 200, description: 'List of incident events' })
  async getTimeline(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') incidentId: string,
  ) {
    return this.dispatcherService.getIncidentTimeline(incidentId);
  }

  @Get('incidents/:id/locations')
  @ApiOperation({ summary: 'Get incident location history' })
  @ApiResponse({ status: 200, description: 'List of location snapshots' })
  async getLocationHistory(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') incidentId: string,
  ) {
    return this.dispatcherService.getLocationHistory(incidentId);
  }

  @Get('incidents/:id/deliveries')
  @ApiOperation({ summary: 'Get incident delivery logs' })
  @ApiResponse({ status: 200, description: 'List of delivery logs' })
  async getDeliveryLogs(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') incidentId: string,
  ) {
    return this.dispatcherService.getDeliveryLogs(incidentId);
  }

  @Get('units')
  @ApiOperation({ summary: 'Get units for agency' })
  @ApiQuery({ name: 'status', enum: ['available', 'busy', 'offline'], required: false })
  @ApiResponse({ status: 200, description: 'List of units' })
  async getUnits(
    @CurrentUser() user: AuthenticatedUser,
    @Query('status') status?: string,
  ) {
    if (!user.agencyId) {
      throw new ForbiddenException('User is not linked to an agency');
    }
    return this.dispatcherService.getAgencyUnits(user.agencyId, status);
  }

  @Post('units/:id/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update unit status (dispatcher override)' })
  @ApiResponse({ status: 200, description: 'Unit status updated' })
  async updateUnitStatus(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') unitId: string,
    @Body() dto: { status: string },
  ) {
    return this.dispatcherService.updateUnitStatus(user, unitId, dto.status);
  }

  @Get('reports/incidents')
  @ApiOperation({ summary: 'Get incident reports for export' })
  @ApiQuery({ name: 'startDate', required: true })
  @ApiQuery({ name: 'endDate', required: true })
  @ApiQuery({ name: 'format', enum: ['json', 'csv'], required: false })
  @ApiResponse({ status: 200, description: 'Incident report data' })
  async getIncidentReport(
    @CurrentUser() user: AuthenticatedUser,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('format') format: string = 'json',
  ) {
    if (!user.agencyId) {
      throw new ForbiddenException('User is not linked to an agency');
    }
    return this.dispatcherService.getIncidentReport(user.agencyId, startDate, endDate, format);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  @ApiResponse({ status: 200, description: 'Dashboard stats' })
  async getStats(@CurrentUser() user: AuthenticatedUser) {
    if (!user.agencyId) {
      throw new ForbiddenException('User is not linked to an agency');
    }
    return this.dispatcherService.getDashboardStats(user.agencyId);
  }
}
