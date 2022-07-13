import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDate,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
} from 'class-validator';

export class CreateRoleDto {
  @IsOptional()
  @IsInt()
  company_id: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  module_id: number;

  @ApiProperty()
  @IsString()
  @MaxLength(50)
  role_name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty()
  @IsInt()
  min_username_length: number;

  @ApiProperty()
  @IsInt()
  max_username_length: number;

  @ApiProperty()
  @IsInt()
  multi_login_allow: number;

  @ApiProperty()
  @IsInt()
  max_wrong_login_attemp: number;

  @ApiProperty()
  @ValidateIf((o) => o.wrong_login_attemp !== '')
  @IsIn(['No Restriction', 'Blocked', 'Block for a Period'])
  @IsString()
  wrong_login_attemp: string;

  @ApiProperty()
  @IsInt()
  block_period: number;

  @ApiProperty()
  @IsInt()
  session_time_out: number;

  @ApiProperty()
  @IsString()
  @MaxLength(255)
  password_regex: string;

  @ApiProperty()
  @IsString()
  @MaxLength(255)
  password_regex_error_msg: string;

  @ApiProperty()
  @IsInt()
  password_expiry_notify: number;

  @ApiProperty()
  @IsInt()
  password_expiry_duration: number;

  @ApiProperty()
  @ValidateIf((o) => o.password_expiry_action !== '')
  @IsIn(['Notify', 'Force'])
  @IsString()
  password_expiry_action: string;

  @IsOptional()
  @IsInt()
  created_by: number;

  @IsOptional()
  @IsDate()
  created_at: Date;
}
