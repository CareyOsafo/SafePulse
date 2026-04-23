import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UssdRequestDto {
  @ApiProperty({ description: 'Telco-provided session ID' })
  @IsString()
  @IsNotEmpty()
  sessionId: string;

  @ApiProperty({ description: 'User phone number', example: '+233241234567' })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ description: 'USSD service code', example: '*920*911#' })
  @IsString()
  @IsNotEmpty()
  serviceCode: string;

  @ApiProperty({ description: 'User input text (chained with *)', example: '1*1' })
  @IsString()
  text: string;
}

export class UssdResponseDto {
  response: string;
  endSession: boolean;
}
