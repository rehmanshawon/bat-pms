import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class MasterGridDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly slug: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  readonly page: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  readonly per_page: number;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  extra: string[];

  @ApiProperty()
  @IsArray()
  @IsOptional()
  search_data: string[];

  @ApiProperty()
  @IsOptional()
  order_by: string;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  search_key: string[];
}
