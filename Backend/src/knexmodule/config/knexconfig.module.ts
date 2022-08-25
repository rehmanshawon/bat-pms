import { Module, Global } from '@nestjs/common';
import { ConfigManagerModule } from '@nestjsplus/config';
import { KnexConfigService } from './knexconfig.service';
import * as path from 'path';

function configResolver(rootFolder: string, environment: string) {
  rootFolder = process.cwd();
  const env_path = `${rootFolder}/src/knexmodule/config/env/${environment}.env`;
  return path.normalize(env_path);
}

@Global()
@Module({
  imports: [
    ConfigManagerModule.register({
      useFunction: configResolver,
    }),
  ],
  providers: [KnexConfigService],
  exports: [KnexConfigService],
})
export class KnexConfigModule {}
