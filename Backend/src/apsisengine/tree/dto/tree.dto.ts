import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class TreeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly tree_slug: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly external_data: string;
}
