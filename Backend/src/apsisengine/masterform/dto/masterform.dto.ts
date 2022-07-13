import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class MasterformDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly form_slug: string;
}
