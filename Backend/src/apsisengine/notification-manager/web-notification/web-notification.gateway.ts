import {
  forwardRef,
  Inject,
  Injectable,
  Logger,
  UseInterceptors,
} from '@nestjs/common';
import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import jwtDecode from 'jwt-decode';
import { Server, Socket } from 'socket.io';
import { JwtPayloadInterface } from 'src/apsisengine/auth/interfaces';
import { NotificationTypesEnum } from 'src/apsisengine/common/enum';
import { RedisPropagatorInterceptor } from 'src/web-socket/redis-propagator/redis-propagator.interceptor';
import { NotificationManagerService } from '../notification-manager.service';
@UseInterceptors(RedisPropagatorInterceptor)
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@Injectable()
export class WebNotificationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger: Logger;
  constructor(
    @Inject(forwardRef(() => NotificationManagerService))
    private readonly notificationManagerService: NotificationManagerService,
  ) {
    this.logger = new Logger('NotificationGateway');
  }
  clients = [];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  afterInit(_server: Server) {
    this.logger.log('Notification Gateway Initiated!');
  }
  handleConnection(client: Socket) {
    this.logger.log(`Client connected => ${client.id}}`);
    this.clients.push(client);
  }
  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected => ${client.id}`);
    this.clients = this.clients.filter((c) => c.id !== client.id);
  }
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('notification')
  public async findAll(@ConnectedSocket() socket: Socket) {
    const userPayload: JwtPayloadInterface = jwtDecode(
      socket.handshake.query.token,
    );

    const unSeenNotificationData =
      await this.notificationManagerService.countUnseenNotification(
        userPayload.user_id,
        NotificationTypesEnum.WEB,
      );

    const getLastRecords =
      await this.notificationManagerService.getLastNotificationRecord(
        userPayload.user_id,
        NotificationTypesEnum.WEB,
      );

    const gatewayData = {};
    gatewayData['countTotalUnseen'] = unSeenNotificationData;
    gatewayData['lastRecords'] = getLastRecords;

    return { event: 'notification', data: JSON.stringify(gatewayData) };
  }

  sendWebNotification(notificationData: any, jwtPayload: JwtPayloadInterface) {
    notificationData.map((element: any) => {
      const notifyData = {
        notificationData: {
          title: element.title,
          message: element.message,
          event_action_id: element.event_action_id,
          receipent_id: element.receipent_id,
        },
        countTotalUnseen: element.countTotalUnseen,
        lastRecords: element.lastRecords,
      };
      this.server
        .to(element.receipent_id)
        .emit('notification', JSON.stringify(notifyData));
    });
    return notificationData;
  }
}
