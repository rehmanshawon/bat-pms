import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class reqDto {
  @ApiProperty()
  @IsString()
  readonly requisition_name: string;
}
