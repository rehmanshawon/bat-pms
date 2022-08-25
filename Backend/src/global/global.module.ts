import { Global, Module } from '@nestjs/common';
import AutoVoucherHelper from './autovoucher.service';
import { CliService } from './cli.oracle.service';
import Common_function from './common_function.service';
import { GlobalController } from './global.controller';
import { VoucherpostingService } from './voucherposting.service';

@Global()
@Module({
  controllers: [GlobalController],
  providers: [
    AutoVoucherHelper,
    VoucherpostingService,
    Common_function,
    CliService,
  ],
  exports: [
    AutoVoucherHelper,
    VoucherpostingService,
    Common_function,
    CliService,
  ],
})
export class GlobalModule {}
