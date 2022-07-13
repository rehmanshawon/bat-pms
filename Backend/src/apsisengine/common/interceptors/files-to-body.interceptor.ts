import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import * as fs from 'fs';
import { MulterConfigService } from 'src/apsisengine/attachment/config';

@Injectable()
export class FilesToBodyInterceptor implements NestInterceptor {
  constructor(private readonly multerConfigService: MulterConfigService) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest();
    let attach_conf: any = {};
    if (req.body.attach_config_slug) {
      attach_conf = await this.multerConfigService.attachConfigData(
        req.body.attach_config_slug,
        req.user.company_id,
      );
    }
    let error = 0;
    // if (attach_conf) {
    //   req.body['allowed_size'] = attach_conf.allowed_size;
    // }
    if (req.body && Array.isArray(req.files) && req.files.length) {
      req.files.forEach((file: Express.Multer.File) => {
        if (file.size > attach_conf.allowed_size) {
          // const deleted_file_path = file.path + '/' + file.filename;
          //fs.unlinkSync(file.path);
          // console.log(file);
          error = 1;
        }
        file.path =
          req.protocol +
          '://' +
          req.get('host') +
          file.destination.replace('.', '') +
          '/' +
          file.filename;
        const { fieldname } = file;
        if (!req.body[fieldname]) {
          req.body[fieldname] = [file];
        } else {
          req.body[fieldname].push(file);
        }
      });
    }

    if (error === 1) {
      req.files.forEach((file: Express.Multer.File) => {
        fs.unlinkSync(file.path);
      });
      const maxSize = await this.multerConfigService.formatBytes(
        attach_conf.allowed_size,
      );
      throw new BadRequestException(
        'File too large! Maximum upload file size is  ' + maxSize,
      );
    }

    return next.handle();
  }
}
