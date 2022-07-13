import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LocalLogoutDto {
  @ApiProperty({
    description: 'logged in users access token',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  readonly access_token: string;

  @ApiProperty({
    description: 'logged in users refresh token',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  readonly refresh_token: string;
}
