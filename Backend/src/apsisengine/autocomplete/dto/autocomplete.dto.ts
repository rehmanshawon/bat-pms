import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AutocompleteDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly dropdown_slug: string;

  @ApiProperty()
  @IsString()
  readonly requested_text: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly external_data: string;
}
