import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class AttachmentDeleteFilesDto {
  @ApiProperty({
    example: 'attach_config_slug',
    description: 'confiig slug of attachment',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  readonly attach_config_slug: string;

  @ApiProperty({
    example: 'attach_log_id',
    description: 'attachment log id',
    required: true,
  })
  @IsArray()
  @IsNotEmpty()
  readonly attach_log_id: number[];
}
