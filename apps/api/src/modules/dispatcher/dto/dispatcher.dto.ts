import {
  IsEnum,
  IsOptional,
  IsString,
  IsBoolean,
  IsUUID,
  IsArray,
  IsNumber,
  Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IncidentStatus,
  EmergencyType,
  IncidentPriority,
  NotificationChannel,
} from '@safepulse/shared';

export class IncidentFiltersDto {
  @ApiPropertyOptional({ enum: IncidentStatus, isArray: true })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  status?: IncidentStatus[];

  @ApiPropertyOptional({ enum: EmergencyType, isArray: true })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  type?: EmergencyType[];

  @ApiPropertyOptional({ enum: IncidentPriority, isArray: true })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  priority?: IncidentPriority[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  region?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  offset?: number;
}

export class AcknowledgeIncidentDto {
  @ApiPropertyOptional({ description: 'Initial dispatcher notes' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ description: 'Auto-dispatch to nearest units', default: true })
  @IsOptional()
  @IsBoolean()
  autoDispatch?: boolean;
}

export class UpdateIncidentStatusDto {
  @ApiProperty({ enum: IncidentStatus })
  @IsEnum(IncidentStatus)
  status: IncidentStatus;

  @ApiPropertyOptional({ description: 'Reason for status change' })
  @IsOptional()
  @IsString()
  reason?: string;
}

export class AddNotesDto {
  @ApiProperty({ description: 'Dispatcher notes to add' })
  @IsString()
  notes: string;
}

export class AssignUnitDto {
  @ApiProperty({ description: 'Unit ID to assign' })
  @IsUUID()
  unitId: string;

  @ApiPropertyOptional({ description: 'Is this the primary responder', default: true })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}

export class SendMessageDto {
  @ApiProperty({ description: 'Recipient phone number' })
  @IsString()
  recipientPhone: string;

  @ApiProperty({ description: 'Message content' })
  @IsString()
  message: string;

  @ApiProperty({ enum: NotificationChannel })
  @IsEnum(NotificationChannel)
  channel: NotificationChannel;
}
