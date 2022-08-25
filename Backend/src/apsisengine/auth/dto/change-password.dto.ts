/**dependencies */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
/** custom validator decorators */
import { Match } from 'src/apsisengine/utils/decorator';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'old password of logged user',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  readonly old_password: string;

  @ApiProperty({
    description: 'new password for user',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  readonly new_password: string;

  @ApiProperty({
    description: 'confirm new password(match with new password) for user',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  //custom decorator to match with other column
  @Match('new_password')
  readonly confirm_new_password: string;

  @ApiProperty({
    description: 'system generated password reset token for change pass',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  readonly password_reset_token: string;
}
