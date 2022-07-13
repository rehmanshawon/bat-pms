import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDate,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
export class CreateCommentChatDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  comment_id: number;

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
