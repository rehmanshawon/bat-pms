import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class DeleteConfigDto {
  @ApiProperty({ type: [Number] })
  @IsArray()
  ids: number[];
}
