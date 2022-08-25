import { Inject, Injectable } from '@nestjs/common';
import { KNEX_CONNECTION } from 'src/knexmodule';

@Injectable()
export class LoggerActivityService {
  constructor(@Inject(KNEX_CONNECTION) private readonly knex) {}

  //log user activities

  async logActivities(data: any) {
    if (data) {
      //console.log(data);
      await this.knex('sys_logger_activitys').insert(data);
    }
  }
}
