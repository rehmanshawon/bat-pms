import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDate,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
export class UpdatemoduleDto {
  @ApiProperty()
  @IsString()
  @MaxLength(100)
  module_name: string;

  @ApiProperty()
  @IsString()
  @MaxLength(100)
  module_icon: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  module_lang: string;

  @ApiProperty()
  @IsString()
  @MaxLength(100)
  module_url: string;

  @IsOptional()
  @IsInt()
  updated_by: number;

  @IsOptional()
  @IsDate()
  updated_at: Date;
}
