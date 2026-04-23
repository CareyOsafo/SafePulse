import { IsEnum, IsOptional, IsString, IsNumber, IsBoolean, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UnitStatus, IncidentStatus } from '@safepulse/shared';

export class UpdateUnitStatusDto {
  @ApiProperty({ enum: UnitStatus, description: 'Unit status' })
  @IsEnum(UnitStatus)
  status: UnitStatus;

  @ApiPropertyOptional({ description: 'Whether unit is on duty' })
  @IsOptional()
  @IsBoolean()
  isOnDuty?: boolean;
}

export class DeclineAssignmentDto {
  @ApiProperty({ description: 'Reason for declining' })
  @IsString()
  reason: string;
}

export class UpdateIncidentStatusDto {
  @ApiProperty({
    enum: [IncidentStatus.EN_ROUTE, IncidentStatus.ON_SCENE],
    description: 'New status',
  })
  @IsEnum(IncidentStatus)
  status: IncidentStatus;

  @ApiPropertyOptional({ description: 'Additional notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UnitLocationDto {
  @ApiProperty({ description: 'Latitude' })
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @ApiProperty({ description: 'Longitude' })
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;

  @ApiPropertyOptional({ description: 'Accuracy in meters' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  accuracy?: number;

  @ApiPropertyOptional({ description: 'Heading in degrees' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(360)
  heading?: number;

  @ApiPropertyOptional({ description: 'Speed in m/s' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  speed?: number;
}

export class AcceptAssignmentDto {
  assignmentId: string;
}

