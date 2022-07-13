import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LocalLoginAuthDto {
  @ApiProperty({
    example: 'username/email',
    description: 'login username/email',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  readonly user: string;

  @ApiProperty({
    example: 'password',
    description: 'valid user password',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
