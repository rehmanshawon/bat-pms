import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class DelegationProcessDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  code: string[];

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  delegation_type: string;

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  delegation_version?: string[];

  @ApiProperty()
  @IsString()
  comments: string;

  @ApiProperty()
  @IsString()
  additional_data: string;
}
