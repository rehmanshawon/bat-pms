import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateCommentChatDto } from './dto/create-comment-chat.dto';
import { UpdateCommentChatDto } from './dto/update-comment-chat.dto';
import { DeleteCommentChatDto } from './dto/delete-comment-chat.dto';
import Common_function from 'src/global/common_function.service';
import { KnexErrorService } from 'src/apsisengine/common/knexerrors';
import { IdlogicService } from 'src/apsisengine/idlogic';
import { KNEX_CONNECTION } from 'src/knexmodule';
import MessageHelper from 'src/apsisengine/common/helpers/messageHelper';

@Injectable()
export class CommentChatService {
  constructor(
    @Inject(KNEX_CONNECTION) private readonly knex,
    private readonly knexErrorService: KnexErrorService,
    private readonly idlogic: IdlogicService,
    private readonly commonFunction: Common_function,
    private readonly messageHelper: MessageHelper,
  ) {}

  async create(createcommentchatdto: CreateCommentChatDto, userPayload) {
    createcommentchatdto.company_id = userPayload.company_id;

    const payload: any = createcommentchatdto;
    payload.created_by = userPayload.user_id;
    payload.created_at = this.commonFunction.cmnDatetime();
    console.log(payload);

    const result = await this.knex('ten_comments')
      .insert(payload, 'comment_id')
      .catch((error) => this.knexErrorService.errorMessage(error.message));

    if (result === undefined || result.length === 0) {
      throw new HttpException(
        'Something is Wrong!!!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return {
      message: 'Created Successfully!!!',
      data: result,
    };
  }

  async findOne(id: number) {
    const data = await this.knex('ten_comments')
      .select(
        'ten_comments.comment_id',
        'ten_comments.tender_id',
        'ten_comments.tender_participant_id',
        'ten_comments.parent_comment_id',
        'ten_comments.comment',
        'ten_comments.created_by',
        'ten_comments.created_at',
        'sys_users.full_name',
      )
      .leftJoin('sys_users', function () {
        this.on('ten_comments.created_by', 'sys_users.user_id').on(
          'ten_comments.company_id',
          'sys_users.company_id',
        );
      })
      .where('ten_comments.tender_participant_id', id)
      .where('ten_comments.status', 1)
      .groupBy(
        'ten_comments.comment_id',
        'ten_comments.tender_id',
        'ten_comments.tender_participant_id',
        'ten_comments.parent_comment_id',
        'ten_comments.comment',
        'sys_users.full_name',
        'ten_comments.created_by',
        'ten_comments.created_at',
      )
      .orderBy('ten_comments.comment_id')
      .catch((error) => this.knexErrorService.errorMessage(error.message));
    //console.log(data);
    if (data === undefined || data.length === 0) {
      throw new HttpException(
        'Something is Wrong!!!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } else {
      const dropdown_tree = (items: any[], parent_comment_id = 0) =>
        items
          .filter((item) => item['parent_comment_id'] === parent_comment_id)
          .map((item) => ({
            key: item['comment_id'],
            comment_id: item['comment_id'],
            tender_id: item['tender_id'],
            tender_participant_id: item['tender_participant_id'],
            parent_comment_id: item['parent_comment_id'],
            comment: item['comment'],
            created_by: item['created_by'],
            created_at: item['created_at'],
            full_name: item['full_name'],
            children: dropdown_tree(items, item['comment_id']),
          }));

      const dropdownData = dropdown_tree(data);
      return {
        message: 'Successfull',
        data: dropdownData,
      };
    }
  }

  async formatDate(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    const strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }

  async update(updatecommentchatdto: UpdateCommentChatDto, userPayload, id) {
    const payload: any = updatecommentchatdto;
    payload.updated_by = userPayload.user_id;
    payload.updated_at = this.commonFunction.cmnDatetime();

    const result = await this.knex('ten_comments')
      .update(payload)
      .where('comment_id', id)
      .catch((error) => this.knexErrorService.errorMessage(error.message));

    if (result === undefined || result.length === 0) {
      return {
        message: await this.messageHelper.lang(
          'ine',
          'sys_comments_update_error',
          {
            code: 'Comments',
          },
        ),
        data: [],
      };
    }
    return {
      message: await this.messageHelper.lang('ine', 'sys_comments_update', {
        code: 'Comments',
      }),
      data: id,
    };
  }
  async remove(id, userPayload) {
    const userId = userPayload.user_id;
    const result = await this.knex('ten_comments')
      .where('comment_id', id)
      .update({
        status: '0',
        deleted_by: userId,
        deleted_at: this.commonFunction.cmnDatetime(),
      })
      .catch((error) => this.knexErrorService.errorMessage(error.message));
    if (result === undefined || result.length === 0) {
      throw new HttpException(
        'Something is Wrong!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return result;
  }

  async addAttchment(commentChatAttach, userPayload) {
    const payload: any[] = commentChatAttach.items;
    for (let i = 0; i < payload.length; i++) {
      payload[i].created_by = userPayload.user_id;
      payload[i].created_at = this.commonFunction.cmnDatetime();
    }

    const result = await this.knex('ten_comments')
      .insert(payload, 'comment_id')
      .catch((error) => this.knexErrorService.errorMessage(error.message));
    if (result.length == 0 || result == undefined) {
      throw new HttpException(
        'Something is wrong!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return result;
  }
}
