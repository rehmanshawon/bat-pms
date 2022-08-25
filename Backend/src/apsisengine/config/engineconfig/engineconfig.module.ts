import { Global, Module } from '@nestjs/common';
import { EngineConfigController } from './engineconfig.controller';
import { EngineConfigService } from './engineconfig.service';

@Global()
@Module({
  providers: [EngineConfigService],
  controllers: [EngineConfigController],
  exports: [EngineConfigService],
})
export class EngineconfigModule {}
