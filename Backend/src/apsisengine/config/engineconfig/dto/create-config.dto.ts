import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDate,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateConfigDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  module_id: number;

  @IsOptional()
  @IsInt()
  company_id: number;

  @IsOptional()
  @IsInt()
  config_id: number;

  @ApiProperty()
  @IsString()
  @MaxLength(100)
  config_slug: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  config_key: string;

  @ApiProperty()
  @IsString()
  @MaxLength(100)
  config_value: string;

  @IsOptional()
  @IsInt()
  created_by: number;

  @IsOptional()
  @IsDate()
  created_at: Date;

  @ApiPropertyOptional()
  @IsOptional()
  test_date: Date;
}
