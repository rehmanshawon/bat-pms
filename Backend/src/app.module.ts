//dependencies
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
//import {ConfigModule} from
import { I18nJsonParser, I18nModule, QueryResolver } from 'nestjs-i18n';
import * as path from 'path';
import { RouterModule } from '@nestjs/core';
//controllers
import { AppController } from './app.controller';
//services
import { AppService } from './app.service';
import { KnexConfigService } from './knexmodule/config/knexconfig.service';
import { KnexErrorModule } from './apsisengine/common/knexerrors';
import { ModuleChangerService } from './apsisengine/modulechanger/index';
//modules
import { KnexModule } from './knexmodule';
import { ApsisengineModule } from './apsisengine/apsisengine.module';
import { KnexConfigModule } from './knexmodule/config/knexconfig.module';
import { IdlogicModule } from './apsisengine/idlogic';
import { TestModuleModule } from './test-module/test-module.module';
import { RedisCacheModule } from './apsisengine/cache';
import { ConsoleModule } from '@squareboat/nest-console';
import { EngineconfigModule } from './apsisengine/config/engineconfig';
//import { CommonFeatureModule } from './modules/common-feature/common-feature.module';
import { AttachmentModule } from './apsisengine/attachment';
// import { SupplyChainModule } from './modules/supplychain/supplychain.module';
// import { PaymentModule } from './modules/payment/payment.module';
// import { RentalModule } from './modules/rental/rental.module';
// import { CitModule } from './modules/cit/cit.module';
// import { DispatchModule } from './modules/dispatch/dispatch.module';
// import { VatTaxModule } from './modules/vat-tax/vat-tax.module';
// import { AdminModule } from './modules/admin/admin.module';
// import { AuditTrailModule } from './apsisengine/audit-trail/audit-trail.module';
// import { AccountModule } from './modules/account/account.module';
// import { ArchivingModule } from './modules/archiving/archiving.module';
// import { FixedAssetModule } from './modules/fixed-asset/fixed-aaset.module';
//configs
import configuration from './apsisengine/config/configuration';

//middlewares
import { LoggerMiddleware } from './apsisengine/middleware/logger.middleware';
import { GlobalModule } from './global';
//import { MemoModule } from './modules/memo/configuration/memo.module';
import { WebSocketModule } from './web-socket/web-socket.module';
import { EventsGateway } from './test.gateway';
import { NNotificationManagerModule } from './apsisengine/notification-manager/notification-manager.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    KnexConfigModule,
    KnexModule.registerAsync({
      useExisting: KnexConfigService,
    }),
    //create modulewise route prefix
    RouterModule.register([
      // {
      //   path: 'account',
      //   module: AccountModule,
      // },
      // {
      //   path: 'supply-chain',
      //   module: SupplyChainModule,
      // },
      // {
      //   path: 'archiving',
      //   module: ArchivingModule,
      // },
      // {
      //   path: 'vat-tax',
      //   module: VatTaxModule,
      // },
      // {
      //   path: 'dispatch',
      //   module: DispatchModule,
      // },
      // {
      //   path: 'fixed-asset',
      //   module: FixedAssetModule,
      // },
      // {
      //   path: 'rental',
      //   module: RentalModule,
      // },
      // {
      //   path: 'cit',
      //   module: CitModule,
      // },
      // {
      //   path: 'memo',
      //   module: MemoModule,
      // },
    ]),
    I18nModule.forRoot({
      fallbackLanguage: '1',
      parser: I18nJsonParser,
      parserOptions: {
        path: path.join(__dirname, '/../i18n'),
      },
      resolvers: [{ use: QueryResolver, options: ['lang', 'locale', 'l'] }],
    }),
    WebSocketModule,
    ApsisengineModule,
    KnexErrorModule,
    IdlogicModule,
    GlobalModule,
    TestModuleModule,
    RedisCacheModule,
    ConsoleModule,
    EngineconfigModule,
    //CommonFeatureModule,
    AttachmentModule,
   // PaymentModule,
   // ArchivingModule,
   // FixedAssetModule,
   // SupplyChainModule,
   // RentalModule,
   // CitModule,
   // DispatchModule,
   // VatTaxModule,
   // AdminModule,
   // AuditTrailModule,
   // AccountModule,
   // MemoModule,
    NNotificationManagerModule,
  ],
  controllers: [AppController],
  providers: [AppService, ModuleChangerService, EventsGateway],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
