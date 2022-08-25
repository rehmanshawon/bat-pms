/**dependencies */
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import jwtDecode from 'jwt-decode';
import * as fs from 'fs';
/**interfaces */
import { JwtPayloadInterface } from 'src/apsisengine/auth/interfaces';
/**KNEX DB query builder connection */
import { KNEX_CONNECTION } from 'src/knexmodule';
/**services */
import { AttachmentService } from '../attachment.service';
import { extname } from 'path';
import { KnexErrorService } from 'src/apsisengine/common/knexerrors';
/**default variables */
const default_dest = process.env.ATTACHMENT_PATH || './public/attachments';
@Injectable({ scope: Scope.REQUEST })
export class MulterConfigService {
  //global varibales
  requestData: any;
  acc_token: any;
  user_data: JwtPayloadInterface;
  attach_path: string;
  constructor(
    @Inject(KNEX_CONNECTION) private readonly knex,
    @Inject(REQUEST) private request: Request,
    private readonly attachmentService: AttachmentService,
    private readonly knexErrorService: KnexErrorService,
  ) {
    //request context
    const cqx = this.request;
    this.requestData = cqx;
    // console.log(cqx);
    //get bearer token key from header
    const bearer_key = cqx.rawHeaders.findIndex((element) =>
      element.includes('Bearer'),
    );
    //get bearer token data
    this.acc_token = cqx.rawHeaders[bearer_key].split('Bearer ');
    //decode bearer token data
    this.user_data = jwtDecode(this.acc_token[1]);
  }

  //get destination path
  async multerDestination(
    request: Request,
    file: Express.Multer.File,
    cb: any,
  ) {
    if (!request.body.attach_config_slug) {
      cb(new NotFoundException('dest - attachment config not found'), false);
    }

    //get attachment configuration
    const attach_conf = await this.attachmentService.attachConfigData(
      request.body.attach_config_slug,
      this.user_data.company_id,
    );
    if (!request.body.reference_id) {
      const attachemtnt_destination_path =
        default_dest +
        '/' +
        attach_conf.company_code +
        '/' +
        attach_conf.attach_path +
        '/undefined';
      console.log(attachemtnt_destination_path);
      if (fs.existsSync(attachemtnt_destination_path)) {
        fs.rmdirSync(attachemtnt_destination_path, { recursive: true });
      }
      cb(new NotFoundException('attachment reference data not found'), false);
    }
    // console.log(request.body);
    const reference_id = request.body.reference_id;
    //set attachment destination path
    const attachemtnt_destination_path =
      default_dest +
      '/' +
      attach_conf.company_code +
      '/' +
      attach_conf.attach_path +
      '/' +
      reference_id;

    //check if the directory exists
    if (!fs.existsSync(attachemtnt_destination_path)) {
      //create directory if not exists
      fs.mkdirSync(attachemtnt_destination_path, { recursive: true });
    }
    //return file destination path
    cb(null, attachemtnt_destination_path);
  }

  //get destination path
  async multerDestinationOtherBank(
    request: Request,
    file: Express.Multer.File,
    cb: any,
  ) {
    const attachemtnt_destination_path = default_dest + '/otherbank';
    if (fs.existsSync(attachemtnt_destination_path)) {
      fs.rmdirSync(attachemtnt_destination_path, { recursive: true });
    }

    //check if the directory exists
    if (!fs.existsSync(attachemtnt_destination_path)) {
      //create directory if not exists
      fs.mkdirSync(attachemtnt_destination_path, { recursive: true });
    }
    //return file destination path
    cb(null, attachemtnt_destination_path);
  }
  //filter file upload
  async fileFilter(request: Request, file: Express.Multer.File, cb: any) {
    if (!request.body.attach_config_slug) {
      // fs.unlinkSync(file.path);
      return cb(new NotFoundException('attachment config not found'), false);
    }
    //get attachment confs
    const attach_conf = await this.attachmentService.attachConfigData(
      request.body.attach_config_slug,
      this.user_data.company_id,
    );
    if (!attach_conf) {
      // fs.unlinkSync(file.path);
      return cb(new NotFoundException('attachment config not found'), false);
    }
    if (!request.body.reference_id) {
      const attachemtnt_destination_path =
        default_dest +
        '/' +
        attach_conf.company_code +
        '/' +
        attach_conf.attach_path +
        '/undefined';

      if (fs.existsSync(attachemtnt_destination_path)) {
        fs.rmdirSync(attachemtnt_destination_path, { recursive: true });
      }
      return cb(
        new NotFoundException('attachment reference data not found'),
        false,
      );
    }
    //extract allowed type and extensions
    const allowed_type = attach_conf.allowed_type.replace(/,/g, '|');
    // const file_extension = extname(file.originalname).replace('.', '');

    //check for file type
    if (!allowed_type.includes(file.mimetype)) {
      cb(
        new HttpException(
          `Unsupported file type ${extname(
            file.originalname,
          )}.allowed types - ${attach_conf.allowed_type}`,
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
      // throw new BadRequestException('file type not matched.');
    } else {
      cb(null, true);
    }
  }
  //filter file upload
  async fileFilterOtherBank(
    request: Request,
    file: Express.Multer.File,
    cb: any,
  ) {
    const allowed_types =
      'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    const allowed_type = allowed_types.replace(/,/g, '|');

    //check for file type
    if (!allowed_type.includes(file.mimetype)) {
      cb(
        new HttpException(
          `Unsupported file type ${extname(
            file.originalname,
          )}.allowed types - ${allowed_types}`,
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
      // throw new BadRequestException('file type not matched.');
    } else {
      cb(null, true);
    }
  }

  //get attach config
  async attachConfigData(attach_config_slug: string, company_id: number) {
    const attachConfData = await this.knex('attach_configs')
      .select('attach_configs.*', 'sys_companys.company_name')
      .leftJoin(
        'sys_companys',
        'attach_configs.company_id',
        'sys_companys.company_id',
      )
      .where('attach_config_slug', attach_config_slug)
      .where('attach_configs.company_id', company_id)
      .first()
      .catch((error) => this.knexErrorService.errorMessage(error.message));

    if (!attachConfData) {
      throw new NotFoundException('attachment configuration not found');
    }

    return attachConfData;
  }

  async file_name_OtherBank(
    request: Request,
    file: Express.Multer.File,
    cb: any,
  ) {
    cb(null, `${Date.now()}${extname(file.originalname)}`);
  }

  async file_name(request: Request, file: Express.Multer.File, cb: any) {
    if (!request.body.attach_config_slug) {
      // fs.unlinkSync(file.path);
      cb(new NotFoundException('attachment config not found'), false);
    }
    const attach_conf = await this.attachmentService.attachConfigData(
      request.body.attach_config_slug,
      this.user_data.company_id,
    );
    if (!request.body.reference_id) {
      const attachemtnt_destination_path =
        default_dest +
        '/' +
        attach_conf.company_code +
        '/' +
        attach_conf.attach_path +
        '/undefined';
      if (fs.existsSync(attachemtnt_destination_path)) {
        fs.rmdirSync(attachemtnt_destination_path, { recursive: true });
      }
      cb(new NotFoundException('attachment reference data not found'), false);
    }
    cb(null, `${Date.now()}${extname(file.originalname)}`);
  }

  //convert bytes to KB/MB/GB
  async formatBytes(bytes: number) {
    const marker = 1000; // Change to 1000 if required
    const decimal = 2; // Change as required
    const kiloBytes = marker; // One Kilobyte is 1024 bytes
    const megaBytes = marker * marker; // One MB is 1024 KB
    const gigaBytes = marker * marker * marker; // One GB is 1024 MB
    // const teraBytes = marker * marker * marker * marker; // One TB is 1024 GB

    // return bytes if less than a KB
    if (bytes < kiloBytes) return bytes + ' Bytes';
    // return KB if less than a MB
    else if (bytes < megaBytes)
      return (bytes / kiloBytes).toFixed(decimal) + ' KB';
    // return MB if less than a GB
    else if (bytes < gigaBytes)
      return (bytes / megaBytes).toFixed(decimal) + ' MB';
    // return GB if less than a TB
    else return (bytes / gigaBytes).toFixed(decimal) + ' GB';
  }
}
