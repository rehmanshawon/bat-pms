import { Controller } from '@nestjs/common';
import AutoVoucherHelper from './autovoucher.service';

@Controller('global')
export class GlobalController {
  constructor(private readonly globalService: AutoVoucherHelper) {}
}
