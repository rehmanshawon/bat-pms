/**dependencies */
import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
/**custom file upload interceptors */
import {
  FilesToBodyInterceptor,
  JsonToObjectsInterceptor,
} from 'src/apsisengine/common/interceptors';

export function ApiFiles(fieldName = 'file') {
  return applyDecorators(
    UseInterceptors(
      FilesInterceptor(fieldName),
      FilesToBodyInterceptor,
      JsonToObjectsInterceptor(['data']),
    ),
  );
}
