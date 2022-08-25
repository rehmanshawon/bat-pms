import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

class attachDefination {
  @ApiProperty()
  @IsInt()
  tender_id: number;

  @ApiProperty()
  @IsInt()
  tender_participant_id: number;

  @ApiProperty()
  @IsInt()
  parent_comment_id: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  comment: string;

  @IsOptional()
  @IsInt()
  created_by: number;

  @IsOptional()
  @IsDate()
  created_at: Date;

  @IsOptional()
  @IsInt()
  company_id: number;
}

export class commentChatAttach {
  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => attachDefination)
  items: attachDefination[];
}
