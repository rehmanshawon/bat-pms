import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class DeleteDropdownUiDto {
  @ApiProperty({ type: [Number] })
  @IsArray()
  ids: number[];
}
