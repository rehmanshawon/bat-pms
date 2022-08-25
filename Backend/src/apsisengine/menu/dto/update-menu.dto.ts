import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
class children {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  key: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  menu_id: number;

  @ApiProperty()
  @IsString()
  @MaxLength(100)
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  module_id: number;

  @ApiPropertyOptional()
  @IsOptional()
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

  @ApiProperty()
  @IsInt()
  parent_menu_id: number;

  @ApiProperty()
  @IsInt()
  sort_number: number;

  @IsOptional()
  @IsBoolean()
  expanded: boolean;

  @IsOptional()
  @IsBoolean()
  checked: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => children)
  children: children[];
}
class menuTree {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  module_id: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  menu_id: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  key: number;

  @IsOptional()
  @IsInt()
  company_id: number;

  @ApiProperty()
  @IsString()
  @MaxLength(100)
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
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

  @ApiProperty()
  @IsInt()
  parent_menu_id: number;

  @ApiProperty()
  @IsInt()
  sort_number: number;

  @IsOptional()
  @IsBoolean()
  expanded: boolean;

  @IsOptional()
  @IsBoolean()
  checked: boolean;

  @IsOptional()
  @IsInt()
  updated_by: number;

  @IsOptional()
  @IsDate()
  updated_at: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => children)
  children: children[];
}
export class UpdatemenuDto {
  @IsOptional()
  @IsInt()
  role_id: number;

  @ApiPropertyOptional()
  @ValidateNested({ each: true })
  @Type(() => menuTree)
  menuTree: menuTree[];

  @IsOptional()
  @IsBoolean()
  expanded: boolean;

  @IsOptional()
  @IsBoolean()
  checked: boolean;

  @IsOptional()
  @IsInt()
  updated_by: number;

  @IsOptional()
  @IsInt()
  company_id: number;

  @IsOptional()
  @IsDate()
  updated_at: Date;
}
