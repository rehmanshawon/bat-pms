/**dependencies */
import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import * as fs from 'fs';
/**knex db imports */
import { KNEX_CONNECTION } from 'src/knexmodule';
import { KnexErrorService } from '../common/knexerrors';
/**interfaces */
import { JwtPayloadInterface } from '../auth/interfaces';
import Helpers from '../common/helpers/apsisHelper';
/**validation dto */
import {
  AttachConfigDto,
  AttachmentDeleteFilesDto,
  AttachmentListDto,
  UploadAttacmenthDto,
} from './dto';
import { AttachmentLogInterface } from './interfaces';

@Injectable()
export class AttachmentService {
  private logger: Logger;
  constructor(
    @Inject(KNEX_CONNECTION) private readonly knex,
    private readonly knexErrorService: KnexErrorService,
  ) {
    this.logger = new Logger('AttachmentLog');
  }

  //get attachment config data
  async getAttachConfData(
    attachConfigDto: AttachConfigDto,
    company_id: number,
  ) {
    const attachConfData = await this.attachConfigData(
      attachConfigDto.attach_config_slug,
      company_id,
    );
    if (!attachConfData) {
      this.logger.log(`${HttpStatus.NOT_FOUND} - no attachment config found`);
      throw new NotFoundException('No attachment config found');
    }

    return attachConfData;
  }

  //get attach config
  async attachConfigData(attach_config_slug: string, company_id: number) {
    const attachConfData = await this.knex('attach_configs')
      .select(
        'attach_configs.*',
        'sys_companys.company_name',
        'sys_companys.company_code',
      )
      .leftJoin(
        'sys_companys',
        'attach_configs.company_id',
        'sys_companys.company_id',
      )
      .where('attach_configs.attach_config_slug', attach_config_slug)
      .where('attach_configs.company_id', company_id)
      .where('attach_configs.status', 1)
      .first()
      .catch((error) => this.knexErrorService.errorMessage(error.message));

    if (!attachConfData) {
      this.logger.log(
        `${HttpStatus.NOT_FOUND} - Attachment configuration not found`,
      );
    }
    return attachConfData;
  }

  //save attach log data
  async saveAttatchMent(
    data: AttachmentLogInterface,
    user_data: JwtPayloadInterface,
    reference_id = null,
  ) {
    let attachment_result = 'No attachment file found';
    const attach_log_data = [];

    if (data.file) {
      if (!data.attach_config_slug) {
        throw new NotFoundException('attachment config not found');
      }
      //get attach config log
      const attachConfig = await this.attachConfigData(
        data.attach_config_slug,
        user_data.company_id,
      );
      //prepare data for attach log
      data.file.forEach((element: any, key: string | number) => {
        const fileData = {
          company_id: user_data.company_id,
          module_id: attachConfig.module_id,
          attach_name: data.file_name
            ? data.file_name[key]
            : element.originalname.split('.')[0],
          attach_original_name: element.filename,
          attach_config_slug: data.attach_config_slug,
          attach_mime_type: element.mimetype,
          reference_table: attachConfig.reference_table,
          reference_column: attachConfig.reference_column,
          reference_id: reference_id ?? data.reference_id,
          attach_type_name: data.attach_type_name
            ? data.attach_type_name[key]
            : null,
          attach_full_path: element.destination,
          attach_path: element.path,
          created_at: Helpers.mysql_datetime(),
          created_by: user_data.user_id,
        };
        attach_log_data.push(fileData);
      });
      const insert_data = await this.knex('attach_logs')
        .insert(attach_log_data, 'attach_log_id')
        .catch((error) => this.knexErrorService.errorMessage(error.message));

      if (!insert_data) {
        this.logger.log(
          `${HttpStatus.BAD_REQUEST} - Attachment log data insertion failed`,
        );
        throw new BadRequestException('Attachment Log insertion failed');
      }
      this.logger.log(
        `${HttpStatus.CREATED} - Attachment log data saved and uploaded successfully`,
      );
      attachment_result = insert_data;
    }

    return attachment_result;
  }
  //upload attachment data
  async uploadAttachData(
    data: UploadAttacmenthDto,
    user_data: JwtPayloadInterface,
  ) {
    const upload = await this.saveAttatchMent(data, user_data);
    return upload;
  }
  //get file list data
  async getUploadedFilesData(data: AttachmentListDto) {
    const attachmentLogs = await this.knex('attach_logs')
      .where('attach_config_slug', data.attach_config_slug)
      .where('reference_id', data.reference_id)
      .where('attach_logs.status', 1)
      .catch((error) => this.knexErrorService.errorMessage(error.message));

    if (!attachmentLogs) {
      this.logger.log(
        `${HttpStatus.NOT_FOUND} - Supporting documents not found`,
      );
      throw new NotFoundException('No supporting documnets found');
    }
    return attachmentLogs;
  }

  //verify and update attachments
  async verifyAndUpdateAttach(
    data: AttachmentDeleteFilesDto,
    user_data: JwtPayloadInterface,
  ) {
    //get attachment log data
    const attachLogData = await this.knex('attach_logs')
      .whereIn('attach_log_id', data.attach_log_id)
      .where('status', 1)
      .catch((error) => this.knexErrorService.errorMessage(error.message));

    if (!attachLogData || attachLogData.length === 0) {
      this.logger.log(`${HttpStatus.NO_CONTENT} - Attachment not found`);
      throw new NotFoundException('attachment not found!');
    }

    //delete log data
    const updateAttachLogData = await this.knex('attach_logs')
      .where('company_id', user_data.company_id)
      .where('attach_config_slug', data.attach_config_slug)
      .whereIn('attach_log_id', data.attach_log_id)
      .update({
        status: 0,
        deleted_by: user_data.user_id,
        deleted_at: Helpers.mysql_datetime(),
      })
      .catch((error) => this.knexErrorService.errorMessage(error.message));

    if (!updateAttachLogData) {
      this.logger.log(`${HttpStatus.NOT_FOUND} - Attachment deletion failed!`);
      throw new NotFoundException('attachment deletion failed!');
    }

    //delete files
    attachLogData.forEach((element) => {
      this.logger.log(
        `${HttpStatus.OK} - Attachment named - ${element.attach_original_name} deleted`,
      );
      //detet files from storage
      //disabled as per decision
      // fs.unlinkSync(element.attach_path);
    });

    return 'attachment deleted successfully';
  }

  //remove attachment
  async removeAttachment(file: any) {
    if (!file) {
      this.logger.log(`${HttpStatus.NO_CONTENT} - Attachment not found`);
      throw new NotFoundException('No attachment found to be deleted');
    }
    //delete files
    file.forEach((element) => {
      this.logger.log(
        `${HttpStatus.OK} - Attachment named - ${element.attach_original_name} deleted`,
      );
      //detet files from storage
      fs.unlinkSync(element.attach_path);
    });

    return 'attachments removed';
  }
}
