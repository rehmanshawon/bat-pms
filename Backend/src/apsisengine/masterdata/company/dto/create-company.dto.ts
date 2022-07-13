import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDate,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
export class CreatecompanyDto {
  @ApiProperty()
  @IsString()
  @MaxLength(20)
  company_code: string;

  @ApiProperty()
  @IsString()
  @MaxLength(50)
  company_name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(5)
  company_short_code: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  company_logo: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  company_address: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(65535)
  company_contact: string;

  @ApiProperty()
  @IsString()
  @MaxLength(20)
  company_mobile: string;

  @IsOptional()
  @IsInt()
  created_by: number;

  @IsOptional()
  @IsDate()
  created_at: Date;
}
