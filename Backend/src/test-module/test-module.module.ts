/**dependencies */
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { MulterConfigService } from 'src/apsisengine/attachment/config';
import { MulterConfigModule } from 'src/apsisengine/attachment/config/multer-config.module';
import { AuditTrailService } from 'src/apsisengine/audit-trail/audit-trail.service';
import { NNotificationManagerModule } from 'src/apsisengine/notification-manager/notification-manager.module';
import { SessionFilterService } from 'src/apsisengine/session-filter';
import { TestModuleController } from './test-module.controller';
import { TestModuleService } from './test-module.service';

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
    NNotificationManagerModule,
  ],
  controllers: [TestModuleController],
  providers: [TestModuleService, AuditTrailService, SessionFilterService],
})
export class TestModuleModule {}
