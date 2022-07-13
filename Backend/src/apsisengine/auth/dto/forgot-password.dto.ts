import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'user_email@mail.com',
    description: 'registered email of user',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  readonly user_email: string;
}
