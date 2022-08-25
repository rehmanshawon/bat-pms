import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AttachmentListDto {
  @ApiProperty({
    example: 'attach_config_slug',
    description: 'confiig slug of attachment',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  readonly attach_config_slug: string;

  @ApiProperty({
    example: 'reference_id',
    description: 'attachment reference id',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  readonly reference_id: string;
}
