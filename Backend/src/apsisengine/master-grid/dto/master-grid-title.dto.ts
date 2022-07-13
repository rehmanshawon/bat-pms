import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class MasterGridTitleDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly slug: string;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  readonly export: number;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  extra: string[];

  @ApiProperty()
  @IsArray()
  @IsOptional()
  search_key: string[];

  @ApiProperty()
  @IsArray()
  @IsOptional()
  search_data: string[];
}
