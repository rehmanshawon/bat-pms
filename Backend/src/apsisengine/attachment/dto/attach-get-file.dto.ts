export class AttachGetFileDto {}
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AttachmentFileDto {
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
  @IsNumber()
  @IsNotEmpty()
  readonly attach_log_id: number;
}
