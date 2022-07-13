import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class DropdownDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly dropdown_slug: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly external_data: string;
}
