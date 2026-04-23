import { IsString, IsOptional, IsBoolean, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Validation } from '@safepulse/shared';

export class CreateContactDto {
  @ApiProperty({ description: 'Contact name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Phone number', example: '+233241234567' })
  @IsString()
  @Matches(Validation.phoneRegex, { message: 'Invalid phone number format' })
  phoneNumber: string;

  @ApiPropertyOptional({ description: 'Relationship (e.g., spouse, parent, friend)' })
  @IsOptional()
  @IsString()
  relationship?: string;

  @ApiPropertyOptional({ description: 'Set as primary contact', default: false })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;

  @ApiPropertyOptional({ description: 'Notify on emergencies', default: true })
  @IsOptional()
  @IsBoolean()
  notifyOnEmergency?: boolean;
}

export class UpdateContactDto {
  @ApiPropertyOptional({ description: 'Contact name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Phone number' })
  @IsOptional()
  @IsString()
  @Matches(Validation.phoneRegex, { message: 'Invalid phone number format' })
  phoneNumber?: string;

  @ApiPropertyOptional({ description: 'Relationship' })
  @IsOptional()
  @IsString()
  relationship?: string;

  @ApiPropertyOptional({ description: 'Set as primary contact' })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;

  @ApiPropertyOptional({ description: 'Notify on emergencies' })
  @IsOptional()
  @IsBoolean()
  notifyOnEmergency?: boolean;
}
