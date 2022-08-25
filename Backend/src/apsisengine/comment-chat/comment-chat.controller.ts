import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CommentChatService } from './comment-chat.service';
import { CreateCommentChatDto } from './dto/create-comment-chat.dto';
import { UpdateCommentChatDto } from './dto/update-comment-chat.dto';
import { DeleteCommentChatDto } from './dto/delete-comment-chat.dto';
import { UserPayload } from 'src/apsisengine/utils/decorator';
import { JwtPayloadInterface } from 'src/apsisengine/auth/interfaces';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/apsisengine/auth/guards';
import { commentChatAttach } from './dto/comment-chat-attach.dto';
@ApiTags('comment-chat')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
@Controller({
  path: 'comment-chat',
  version: '1',
})
export class CommentChatController {
  constructor(private readonly commentChatService: CommentChatService) {}
  @ApiOperation({
    summary: 'create a new comment-chat',
    description:
      'this comment-chat api is responsible for creating a comment-chat by post request. to make post request check json format properly',
  })
  @Post()
  async create(
    @Body() createcommentchatdto: CreateCommentChatDto,
    @UserPayload() userPayload: JwtPayloadInterface,
  ) {
    const data = await this.commentChatService.create(
      createcommentchatdto,
      userPayload,
    );
    return { message: data.message, result: data.data };
  }
  @ApiOperation({
    summary: 'Show a single comment-chat',
    description:
      'this comment-chat api is responsible for fetching a comment-chat from database',
  })
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.commentChatService.findOne(+id);
    return { message: 'Success', result: data };
  }

  @ApiOperation({
    summary: 'Delete a comment-chat',
    description:
      'this comment-chat api is responsible for deleting a comment-chat by corresponding id.',
  })
  @Patch('/delete/:id')
  async remove(
    @Param('id') id: number,
    @UserPayload() userPayload: JwtPayloadInterface,
  ) {
    const data = await this.commentChatService.remove(id, userPayload);
    return { message: 'Successfully deleted!', result: data };
  }

  @ApiOperation({
    summary: 'Update a comment-chat',
    description:
      'this comment-chat api is responsible for updating a comment-chat by patch request. to make patch request check json format properly',
  })
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updatecommentchatdto: UpdateCommentChatDto,
    @UserPayload() userPayload: JwtPayloadInterface,
  ) {
    const data = await this.commentChatService.update(
      updatecommentchatdto,
      userPayload,
      id,
    );
    return { message: data.message, result: data.data };
  }

  @Post('/addAttchment')
  async addAttchment(
    @Body() commentChatAttach: commentChatAttach,
    @UserPayload() userPayload: JwtPayloadInterface,
  ) {
    const data = await this.commentChatService.addAttchment(
      commentChatAttach,
      userPayload,
    );
    return { message: 'Success', result: data };
  }
}
