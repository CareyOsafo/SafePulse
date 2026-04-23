import { IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Validation } from '@safepulse/shared';

export class StartKycDto {
  @ApiProperty({
    description: 'Ghana Card number',
    example: 'GHA-123456789-0',
    pattern: 'GHA-[0-9]{9}-[0-9]',
  })
  @IsString()
  @Matches(Validation.ghanaCardRegex, {
    message: 'Invalid Ghana Card number format. Expected: GHA-XXXXXXXXX-X',
  })
  ghanaCardNumber: string;
}
