import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OrderCreatedEvent } from '../events/order-created.events';

@Injectable()
export class OrderCreatedListener {
  @OnEvent('event')
  handleOrderCreatedEvent(event: OrderCreatedEvent) {
    // handle and process "OrderCreatedEvent" event
    console.log(event);
  }
}
