import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { UnitsService } from './units.service';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { AuthenticatedUser } from '../../auth/auth.service';
import { AppRole } from '@safepulse/shared';
import {
  UpdateUnitStatusDto,
  AcceptAssignmentDto,
  DeclineAssignmentDto,
  UpdateIncidentStatusDto,
  UnitLocationDto,
} from './dto/unit.dto';

@ApiTags('units')
@ApiBearerAuth()
@Controller('unit')
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Get('me')
  @Roles(AppRole.UNIT)
  @ApiOperation({ summary: 'Get current unit profile' })
  @ApiResponse({ status: 200, description: 'Unit profile' })
  async getMyUnit(@CurrentUser() user: AuthenticatedUser) {
    return this.unitsService.getUnitByUserId(user.id);
  }

  @Post('me/status')
  @Roles(AppRole.UNIT)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update unit status (Available/Busy/Offline)' })
  @ApiResponse({ status: 200, description: 'Status updated' })
  async updateMyStatus(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateUnitStatusDto,
  ) {
    return this.unitsService.updateUnitStatus(user.unitId!, dto);
  }

  @Post('me/location')
  @Roles(AppRole.UNIT)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update unit location' })
  @ApiResponse({ status: 200, description: 'Location updated' })
  async updateMyLocation(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UnitLocationDto,
  ) {
    return this.unitsService.updateUnitLocation(user.unitId!, dto);
  }

  @Get('me/assignments')
  @Roles(AppRole.UNIT)
  @ApiOperation({ summary: 'Get unit assignments' })
  @ApiResponse({ status: 200, description: 'List of assignments' })
  async getMyAssignments(
    @CurrentUser() user: AuthenticatedUser,
    @Query('active') active?: boolean,
  ) {
    return this.unitsService.getUnitAssignments(user.unitId!, active);
  }

  @Post('assignments/:assignmentId/accept')
  @Roles(AppRole.UNIT)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Accept an assignment offer' })
  @ApiResponse({ status: 200, description: 'Assignment accepted' })
  @ApiResponse({ status: 400, description: 'Assignment expired or already responded' })
  async acceptAssignment(
    @CurrentUser() user: AuthenticatedUser,
    @Param('assignmentId') assignmentId: string,
  ) {
    return this.unitsService.acceptAssignment(user.unitId!, assignmentId);
  }

  @Post('assignments/:assignmentId/decline')
  @Roles(AppRole.UNIT)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Decline an assignment offer' })
  @ApiResponse({ status: 200, description: 'Assignment declined' })
  async declineAssignment(
    @CurrentUser() user: AuthenticatedUser,
    @Param('assignmentId') assignmentId: string,
    @Body() dto: DeclineAssignmentDto,
  ) {
    return this.unitsService.declineAssignment(user.unitId!, assignmentId, dto.reason);
  }

  @Get('assignments/:assignmentId')
  @Roles(AppRole.UNIT)
  @ApiOperation({ summary: 'Get assignment details' })
  @ApiResponse({ status: 200, description: 'Assignment details with incident info' })
  async getAssignment(
    @CurrentUser() user: AuthenticatedUser,
    @Param('assignmentId') assignmentId: string,
  ) {
    return this.unitsService.getAssignmentDetails(user.unitId!, assignmentId);
  }

  @Post('incidents/:incidentId/status')
  @Roles(AppRole.UNIT)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update incident status (en_route, on_scene)' })
  @ApiResponse({ status: 200, description: 'Status updated' })
  async updateIncidentStatus(
    @CurrentUser() user: AuthenticatedUser,
    @Param('incidentId') incidentId: string,
    @Body() dto: UpdateIncidentStatusDto,
  ) {
    return this.unitsService.updateIncidentStatus(user.unitId!, incidentId, dto);
  }

  @Post('incidents/:incidentId/location')
  @Roles(AppRole.UNIT)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send unit location ping for active incident' })
  @ApiResponse({ status: 200, description: 'Location recorded' })
  async pingLocation(
    @CurrentUser() user: AuthenticatedUser,
    @Param('incidentId') incidentId: string,
    @Body() dto: UnitLocationDto,
  ) {
    return this.unitsService.recordLocationPing(user.unitId!, incidentId, dto);
  }

  @Post('incidents/:incidentId/resolve')
  @Roles(AppRole.UNIT)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resolve incident (long press to confirm)' })
  @ApiResponse({ status: 200, description: 'Incident resolved' })
  async resolveIncident(
    @CurrentUser() user: AuthenticatedUser,
    @Param('incidentId') incidentId: string,
    @Body() dto?: { notes?: string },
  ) {
    return this.unitsService.resolveIncident(user.unitId!, incidentId, dto?.notes);
  }

  @Post('incidents/:incidentId/need-backup')
  @Roles(AppRole.UNIT)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request backup for incident' })
  @ApiResponse({ status: 200, description: 'Backup requested' })
  async requestBackup(
    @CurrentUser() user: AuthenticatedUser,
    @Param('incidentId') incidentId: string,
    @Body() dto?: { notes?: string },
  ) {
    return this.unitsService.requestBackup(user.unitId!, incidentId, dto?.notes);
  }

  @Post('incidents/:incidentId/cant-locate')
  @Roles(AppRole.UNIT)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Report unable to locate caller' })
  @ApiResponse({ status: 200, description: 'Reported' })
  async cantLocate(
    @CurrentUser() user: AuthenticatedUser,
    @Param('incidentId') incidentId: string,
    @Body() dto?: { notes?: string },
  ) {
    return this.unitsService.reportCantLocate(user.unitId!, incidentId, dto?.notes);
  }

  @Get('history')
  @Roles(AppRole.UNIT)
  @ApiOperation({ summary: 'Get unit assignment history' })
  @ApiResponse({ status: 200, description: 'Assignment history' })
  async getHistory(
    @CurrentUser() user: AuthenticatedUser,
    @Query('limit') limit: number = 50,
    @Query('offset') offset: number = 0,
  ) {
    return this.unitsService.getAssignmentHistory(user.unitId!, limit, offset);
  }
}
