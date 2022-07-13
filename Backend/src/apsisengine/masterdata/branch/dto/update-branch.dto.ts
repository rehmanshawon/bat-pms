import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDate,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
export class UpdatebranchDto {
  @IsOptional()
  @IsInt()
  company_id: number;

  @ApiProperty()
  @IsString()
  @MaxLength(20)
  branch_code: string;

  @ApiProperty()
  @IsString()
  @MaxLength(50)
  branch_name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(5)
  branch_short_code: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  branch_logo: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(65535)
  branch_address: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(65535)
  branch_contact: string;

  @ApiProperty()
  @IsInt()
  branch_mobile: number;

  @IsOptional()
  @IsInt()
  updated_by: number;

  @IsOptional()
  @IsDate()
  updated_at: Date;
}
