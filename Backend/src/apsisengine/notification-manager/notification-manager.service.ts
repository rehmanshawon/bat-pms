import { Inject, Injectable } from '@nestjs/common';
import Common_function from 'src/global/common_function.service';
import { KNEX_CONNECTION } from 'src/knexmodule';
import { JwtPayloadInterface } from '../auth/interfaces';
import { NotificationTypesEnum } from '../common/enum';
import { KnexErrorService } from '../common/knexerrors';
import { NotificationDto } from './dto/notification.dto';
import { WebNotificationService } from './web-notification/web-notification.service';

@Injectable()
export class NotificationManagerService {
  constructor(
    private readonly webNotificationService: WebNotificationService,
    @Inject(KNEX_CONNECTION) private readonly knex,
    private readonly knexErrorService: KnexErrorService,
    private readonly helpers: Common_function,
  ) {}

  async sendNotification(
    data: NotificationDto,
    jwtPayload: JwtPayloadInterface,
  ) {
    //get the event data
    const eventData = await this.knex('notify_events')
      .where('event_name', data.eventSlug)
      .first();
    let results: any;
    if (eventData) {
      if (eventData.web_notification == 'Enable') {
        results = await this.webNotificationService.sendWebNotification(
          data,
          jwtPayload,
        );
      }

      // if (eventData.sms_notification == 'Enable') {
      // }

      // if (eventData.email_notification == 'Enable') {
      // }

      // if (eventData.app_notification == 'Enable') {
      // }
    }
    return results;
  }

  //matched regexes
  private escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  }
  private replaceAll(str: string, find: string, replace: string) {
    return str.replace(new RegExp(this.escapeRegExp(find), 'g'), replace);
  }

  //save notification data
  async saveNotificationData(
    data: NotificationDto,
    jwtPayload: JwtPayloadInterface,
  ) {
    const mapObj = {
      code: '{CODE}',
      name: '{NAME}}',
    };
    //get the event data
    const eventData = await this.knex('notify_events')
      .where('event_name', data.eventSlug)
      .first();
    const eventActionData = [];
    const eventOutBoxData = [];
    let messageSubject = '';
    let messageBody = '';
    let action_url = '';
    let prepareNotificationData = {};
    const prepareNotificationDetails: any = [];

    if (eventData) {
      //save event data if web notification is enabled
      if (eventData.web_notification === 'Enable') {
        await Promise.all(
          data.data.receipent_id.map(async (element) => {
            const checkReceipentConfigData = await this.knex(
              'notify_user_configs',
            )
              .where('user_id', element)
              .where('event_id', eventData.event_id)
              .first();

            //prepare event action details data
            const actionDataDetails = {
              event_id: eventData.event_id,
              action_fire: this.helpers.cmnDatetime(),
              action_priority: data.actionPriority ?? 'Low',
              action_reference: data.data.code,
              sender_id: data.sender_id ?? jwtPayload.user_id,
            };
            eventActionData.push(actionDataDetails);

            //insert data into event action table
            const insertEventAction = await this.knex('notify_event_actions')
              .insert(actionDataDetails)
              .returning('event_action_id')
              .catch((error) =>
                this.knexErrorService.errorMessage(error.message),
              );

            const eventActionsId = await insertEventAction[0];
            //set frontend route url
            action_url = eventData.action_url;
            //set message data
            messageBody = eventData.web_template;

            for (const key in mapObj) {
              const search = mapObj[key];
              const replaceWith = data.data.code;
              messageBody = this.replaceAll(messageBody, search, replaceWith);
              action_url = action_url
                ? this.replaceAll(action_url, search, replaceWith)
                : null;
            }

            messageSubject = eventData.event_title;

            //prepare notify event outbox
            const eventOutboxDetails = {
              event_action_id: eventActionsId,
              message_subject: messageSubject,
              message_body: messageBody,
              recipent_user_id: element,
              notify_status:
                checkReceipentConfigData &&
                checkReceipentConfigData.web_notification === 'Disable'
                  ? 'Blocked by receipent'
                  : 'Draft',
              notify_type: NotificationTypesEnum.WEB,
              action_url: action_url,
            };
            eventOutBoxData.push(eventOutboxDetails);

            //insert event outbox
            await this.knex('notify_event_outbox').insert(eventOutBoxData);

            //count unseen notification status
            const unseenNotificationCount: number =
              await this.countUnseenNotification(
                element,
                NotificationTypesEnum.WEB,
              );

            //get last 5 notification for the exisiting user
            const lastNotificationRecords =
              await this.getLastNotificationRecord(
                element,
                NotificationTypesEnum.WEB,
              );

            prepareNotificationData = {
              title: messageSubject,
              message: messageBody,
              event_action_id: eventActionsId,
              receipent_id: element,
              countTotalUnseen: unseenNotificationCount,
              lastRecords: lastNotificationRecords,
            };

            prepareNotificationDetails.push(prepareNotificationData);
          }),
        );
      }
    }

    return prepareNotificationDetails;
  }
  //count total unseen notification for users
  async countUnseenNotification(
    recipent_user_id: any,
    notificationTYpe: NotificationTypesEnum,
  ) {
    const result = await this.knex('notify_event_outbox')
      .where('recipent_user_id', recipent_user_id)
      .where('notify_type', notificationTYpe)
      .where('notify_status', 'Draft')
      .where(this.knex.raw(`"seen_at" IS NULL`))
      .count('recipent_user_id as total')
      .catch((error) => this.knexErrorService.errorMessage(error.message));

    return result[0]?.total;
  }

  //show last 5 notification for the connected user
  async getLastNotificationRecord(
    recipent_user_id: any,
    notifyType: NotificationTypesEnum,
    limit?: number,
  ) {
    const results = await this.knex('notify_event_outbox')
      .where('notify_status', 'Draft')
      .where(this.knex.raw(`"seen_at" IS NULL`))
      .where('recipent_user_id', recipent_user_id)
      .where('notify_type', notifyType)
      .limit(limit ?? 5)
      .orderBy('notify_event_outbox.event_outbox_id', 'DESC')
      .catch((error) => this.knexErrorService.errorMessage(error.message));

    return results;
  }
}
