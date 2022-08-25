import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ForgotPasswordQueryDto {
  @ApiProperty({
    description: 'forgot password reset token as query param',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  reset_token: string;
}
