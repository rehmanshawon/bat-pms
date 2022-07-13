import { Global, Module } from '@nestjs/common';
import { IdlogicService } from './idlogic.oracle.service';

@Global()
@Module({
  providers: [IdlogicService],
  exports: [IdlogicService],
})
export class IdlogicModule {}
