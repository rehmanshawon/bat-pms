import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDate,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
export class CreatemenuDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  module_id: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  menu_id: number;

  @IsOptional()
  @IsInt()
  company_id: number;

  @ApiProperty()
  @IsString()
  @MaxLength(100)
  menu_name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  menu_description: string;

  @ApiProperty()
  @IsString()
  @MaxLength(100)
  menu_icon_class: string;

  @ApiProperty()
  @IsString()
  @MaxLength(100)
  menu_url: string;

  @IsOptional()
  @IsInt()
  parent_menu_id: number;

  @IsOptional()
  @IsInt()
  sort_number: number;

  @IsOptional()
  @IsInt()
  created_by: number;

  @IsOptional()
  @IsDate()
  created_at: Date;

  @IsOptional()
  @IsInt()
  updated_by: number;

  @IsOptional()
  @IsDate()
  updated_at: Date;
}
