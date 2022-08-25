import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { MatchApiFiles } from 'src/apsisengine/utils/decorator';

export class UploadAttacmenthDto {
  @ApiProperty({
    example: 'attach_config_slug',
    description: 'unique attachment configuration indentifier',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => o.file || o.attach_config_slug)
  readonly attach_config_slug: string;

  @ApiProperty({
    example: 'reference_id',
    description: 'database reference table column id',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => o.file || o.reference_id)
  reference_id: string;

  @ApiProperty({
    example: 'file_name',
    description: 'custom file name',
    required: false,
  })
  @IsArray()
  // @ValidateNested({ each: true })
  @IsOptional()
  readonly file_name: string[];

  @ApiProperty({
    example: 'attach_type',
    description: 'attach type',
    required: false,
  })
  @IsArray()
  // @ValidateNested({ each: true })
  @IsOptional()
  readonly attach_type_name: string[];

  @ApiProperty({
    description: 'file',
    required: true,
  })
  @MatchApiFiles({ isArray: true })
  @IsArray()
  @IsOptional()
  readonly file: Express.Multer.File[];
}
