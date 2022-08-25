import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './apsisengine/auth/guards';
import { JwtPayloadInterface } from './apsisengine/auth/interfaces';
// import { NotificationDto } from './apsisengine/notification-manager/dto/notification.dto';
// import { NotificationManagerService } from './apsisengine/notification-manager/notification-manager.service';
import { UserPayload } from './apsisengine/utils/decorator';
import { EventsGateway } from './test.gateway';

@Controller({
  path: '',
})
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly eventGateWayService: EventsGateway, // private readonly notificationManagerService: NotificationManagerService,
  ) {}

  @Get()
  getHello() {
    const data = this.appService.getHello();
    return { message: 'successfull', result: data };
  }

  @UseGuards(JwtAuthGuard)
  @Post('app')
  async socketTestData(
    @Body() data: any,
    @UserPayload() jwtPayload: JwtPayloadInterface,
  ) {
    const result = await this.appService.testNotify(data, jwtPayload);
    // const result = await this.notificationManagerService.sendNotification(
    //   data,
    //   jwtPayload,
    // );
    return { message: 'successfull', result: result };
  }
}
