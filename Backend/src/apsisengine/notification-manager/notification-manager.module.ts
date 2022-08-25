import { Global, Module } from '@nestjs/common';
import { NotificationManagerService } from './notification-manager.service';
import { WebNotificationGateway } from './web-notification/web-notification.gateway';
import { WebNotificationService } from './web-notification/web-notification.service';

@Global()
@Module({
  providers: [
    NotificationManagerService,
    WebNotificationService,
    WebNotificationGateway,
  ],
  exports: [NotificationManagerService],
})
export class NNotificationManagerModule {}
