import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDate,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
export class UpdatefeatureDto {
  @ApiProperty()
  @IsString()
  @MaxLength(100)
  feature_name: string;

  @ApiProperty()
  @IsString()
  @MaxLength(100)
  feature_slug: string;

  @ApiProperty()
  @IsInt()
  parent_feature_id: number;

  @ApiProperty()
  @IsInt()
  sort_number: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  module_id: number;

  @IsOptional()
  @IsInt()
  updated_by: number;

  @IsOptional()
  @IsDate()
  updated_at: Date;
}
