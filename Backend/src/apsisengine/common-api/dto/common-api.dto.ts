import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class CommonApiDto {
  @ApiProperty()
  @IsOptional()
  @IsInt()
  status_code: number;

  @ApiProperty()
  @IsString()
  @MaxLength(100)
  slug: string;

  @ApiProperty()
  @IsString()
  @MaxLength(100)
  code: string;
}
