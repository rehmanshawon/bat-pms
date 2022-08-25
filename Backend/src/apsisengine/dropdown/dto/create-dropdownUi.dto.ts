import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDate,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
export class CreateDropdownUiDto {
  @ApiProperty()
  @IsString()
  @MaxLength(50)
  dropdown_name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  module_id: number;

  @IsOptional()
  @IsInt()
  company_id: number;

  @ApiProperty()
  @IsString()
  @MaxLength(50)
  dropdown_slug: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  dropdown_mode: string;

  @ApiProperty()
  @IsString()
  @MaxLength(2000)
  sql_select: string;

  @ApiProperty()
  @IsString()
  @MaxLength(2000)
  sql_source: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  sql_condition: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  sql_group_by: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  sql_having: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  sql_order_by: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  sql_limit: string;

  @ApiProperty()
  @IsString()
  @MaxLength(50)
  value_field: string;

  @ApiProperty()
  @IsString()
  @MaxLength(50)
  option_field: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  search_columns: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description: string;

  @IsOptional()
  @IsInt()
  created_by: number;

  @IsOptional()
  @IsDate()
  created_at: Date;
}
