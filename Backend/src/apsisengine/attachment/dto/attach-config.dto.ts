import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AttachConfigDto {
  @ApiProperty({
    example: 'slug_name',
    description: 'attachment configuration slug name',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  readonly attach_config_slug: string;
}
