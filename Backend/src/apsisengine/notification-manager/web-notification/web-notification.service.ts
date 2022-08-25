import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtPayloadInterface } from 'src/apsisengine/auth/interfaces';
import { NotificationDto } from '../dto/notification.dto';
import { NotificationManagerService } from '../notification-manager.service';
import { WebNotificationGateway } from './web-notification.gateway';
@Injectable()
export class WebNotificationService {
  constructor(
    private webNotificationGateway: WebNotificationGateway,
    @Inject(forwardRef(() => NotificationManagerService))
    private readonly notificationManagerService: NotificationManagerService,
  ) {}

  async sendWebNotification(
    data: NotificationDto,
    jwtPayload: JwtPayloadInterface,
  ) {
    const notificationData =
      await this.notificationManagerService.saveNotificationData(
        data,
        jwtPayload,
      );
    // console.log(notificationData);
    this.webNotificationGateway.sendWebNotification(
      notificationData,
      jwtPayload,
    );
    return data;
  }
}
