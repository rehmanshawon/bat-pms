import { Global, Module } from '@nestjs/common';
//import { AuditTrailService } from './audit-trail.service';
import { AuditTrailService } from './audit-trail-oracle.service';

@Global()
@Module({
  providers: [AuditTrailService],
  exports: [AuditTrailService],
})
export class AuditTrailModule {}
