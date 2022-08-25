import { PartialType } from '@nestjs/swagger';
import { CreateCommentChatDto } from './create-comment-chat.dto';

export class UpdateCommentChatDto extends PartialType(CreateCommentChatDto) {
  updated_at: Date;
  updated_by: number;
}
