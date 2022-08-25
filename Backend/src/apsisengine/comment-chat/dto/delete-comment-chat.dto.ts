import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class DeleteCommentChatDto {
  @ApiProperty()
  @IsInt()
  comment_id: number;
}
