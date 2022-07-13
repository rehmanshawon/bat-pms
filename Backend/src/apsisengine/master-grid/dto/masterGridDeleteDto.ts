import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class DeleteMasterGridDto {
  @ApiProperty({ type: [String] })
  @IsArray()
  ids: string[];
}
