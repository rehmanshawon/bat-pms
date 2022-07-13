import { Global, Module } from '@nestjs/common';
import { AttachmentService } from './attachment.service';
import { AttachmentController } from './attachment.controller';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from './config/multer-config.service';
import { diskStorage } from 'multer';
import { MulterConfigModule } from './config/multer-config.module';

@Global()
@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [MulterConfigModule],
      inject: [MulterConfigService],
      useFactory: async (multerConfigService: MulterConfigService) => {
        return {
          storage: diskStorage({
            destination: async (req, file, cb) => {
              if (file) {
                //get the file destination path

                return await multerConfigService.multerDestination(
                  req,
                  file,
                  cb,
                );
              }
            },
            //get the file name
            filename: async (req, file, cb) => {
              if (file) {
                return await multerConfigService.file_name(req, file, cb);
              }
            },
          }),
          //filter file
          fileFilter: async (req, file: Express.Multer.File, cb) => {
            // console.log(req);
            if (file) {
              return await multerConfigService.fileFilter(req, file, cb);
            }
          },
        };
      },
    }),
    MulterConfigModule,
  ],
  controllers: [AttachmentController],
  providers: [AttachmentService, MulterConfigService],
  exports: [AttachmentService],
})
export class AttachmentModule {}
