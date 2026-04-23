import { IsEnum, IsOptional, ValidateNested, IsNumber, IsString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  EmergencyType,
  IncidentPriority,
  LocationSource,
  LocationConfidence,
} from '@safepulse/shared';

export class CoordinatesDto {
  @ApiProperty({ description: 'Latitude', example: 5.6037 })
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @ApiProperty({ description: 'Longitude', example: -0.1870 })
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;

  @ApiPropertyOptional({ description: 'Accuracy in meters', example: 10 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  accuracy?: number;

  @ApiPropertyOptional({ description: 'Altitude in meters' })
  @IsOptional()
  @IsNumber()
  altitude?: number;

  @ApiPropertyOptional({ description: 'Heading in degrees (0-360)' })
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

export class LocationBundleDto {
  @ApiProperty({ type: CoordinatesDto })
  @ValidateNested()
  @Type(() => CoordinatesDto)
  coordinates: CoordinatesDto;

  @ApiProperty({ enum: LocationSource, example: LocationSource.GPS })
  @IsEnum(LocationSource)
  source: LocationSource;

  @ApiPropertyOptional({ enum: LocationConfidence })
  @IsOptional()
  @IsEnum(LocationConfidence)
  confidence?: LocationConfidence;

  @ApiPropertyOptional({ description: 'ISO timestamp when location was captured' })
  @IsOptional()
  @IsString()
  timestamp?: string;

  @ApiPropertyOptional({ description: 'Landmark description for manual locations' })
  @IsOptional()
  @IsString()
  landmark?: string;

  @ApiPropertyOptional({ description: 'Saved place ID (home/work)' })
  @IsOptional()
  @IsString()
  savedPlaceId?: string;

  @ApiPropertyOptional({ description: 'Saved place name' })
  @IsOptional()
  @IsString()
  savedPlaceName?: string;
}

export class CreateIncidentDto {
  @ApiProperty({
    enum: EmergencyType,
    description: 'Type of emergency',
    example: EmergencyType.MEDICAL,
  })
  @IsEnum(EmergencyType)
  emergencyType: EmergencyType;

  @ApiProperty({ type: LocationBundleDto, description: 'Location information' })
  @ValidateNested()
  @Type(() => LocationBundleDto)
  location: LocationBundleDto;

  @ApiPropertyOptional({
    enum: IncidentPriority,
    description: 'Priority level',
    example: IncidentPriority.NORMAL,
  })
  @IsOptional()
  @IsEnum(IncidentPriority)
  priority?: IncidentPriority;

  @ApiPropertyOptional({ description: 'Additional description' })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateLocationDto {
  @ApiProperty({ type: CoordinatesDto })
  @ValidateNested()
  @Type(() => CoordinatesDto)
  coordinates: CoordinatesDto;

  @ApiPropertyOptional({ enum: LocationSource })
  @IsOptional()
  @IsEnum(LocationSource)
  source?: LocationSource;
}
