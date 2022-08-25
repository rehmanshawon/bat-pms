import { Injectable, UseInterceptors } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server } from 'socket.io';
import { RedisPropagatorInterceptor } from './web-socket/redis-propagator/redis-propagator.interceptor';
@UseInterceptors(RedisPropagatorInterceptor)
@WebSocketGateway({ cors: true })
@Injectable()
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  public orders: any = [
    {
      id: 1,
      name: 'Order #1',
      description: 'Description order #1',
    },
    {
      id: 2,
      name: 'Order #2',
      description: 'Description order #2',
    },
  ];

  @SubscribeMessage('events')
  public findAll(): Observable<any> {
    return from([1, 2, 3]).pipe(
      map((item) => {
        return { event: 'events', data: item };
      }),
    );
  }

  socketTest(data: any) {
    const order = {
      id: this.orders.length + 1,
      ...data,
    };
    this.orders.push(order);

    this.server.emit('events', this.orders);

    return data;
  }
}
