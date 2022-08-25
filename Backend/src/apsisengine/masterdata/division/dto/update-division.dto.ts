import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDate,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
export class UpdatedivisionDto {
  @IsOptional()
  @IsInt()
  company_id: number;

  @ApiProperty()
  @IsString()
  @MaxLength(20)
  division_code: string;

  @ApiProperty()
  @IsString()
  @MaxLength(50)
  division_name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(5)
  division_short_code: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  division_logo: string;

  @IsOptional()
  @IsInt()
  updated_by: number;

  @IsOptional()
  @IsDate()
  updated_at: Date;
}
