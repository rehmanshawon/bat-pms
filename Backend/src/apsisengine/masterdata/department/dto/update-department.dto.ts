import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDate,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
export class UpdatedepartmentDto {
  @IsOptional()
  @IsInt()
  company_id: number;

  @ApiProperty()
  @IsString()
  @MaxLength(20)
  department_code: string;

  @ApiProperty()
  @IsString()
  @MaxLength(50)
  department_name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(5)
  department_short_code: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  department_logo: string;

  @IsOptional()
  @IsInt()
  updated_by: number;

  @IsOptional()
  @IsDate()
  updated_at: Date;
}
