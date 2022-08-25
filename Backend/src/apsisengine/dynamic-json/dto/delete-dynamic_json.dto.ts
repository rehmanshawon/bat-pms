import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class DeleteDynamicJsonDto {
  @ApiProperty({ type: [Number] })
  @IsArray()
  ids: number[];
}
