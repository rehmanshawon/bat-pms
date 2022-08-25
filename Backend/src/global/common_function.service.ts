/**dependencies */
import { Inject, Injectable } from '@nestjs/common';
import { KNEX_CONNECTION } from 'src/knexmodule';
import { KnexErrorService } from 'src/apsisengine/common/knexerrors';
import { DateTime } from 'luxon';

@Injectable()
export default class Common_function {
  constructor(
    @Inject(KNEX_CONNECTION) private readonly knex,
    private readonly knexErrorService: KnexErrorService,
  ) {}

  cmnDatetime(date = null) {
    const connection = this.knex.client.config.client;
    if (connection === 'oracledb') {
      if (date) {
        return new Date(date);
      } else {
        return new Date();
      }
    } else if (connection === 'pg') {
      if (date) {
        return DateTime.fromJSDate(date).toUTC().toFormat('yyyy-MM-dd TT');
      } else {
        return DateTime.now().toUTC().toFormat('yyyy-MM-dd TT');
      }
    }
  }

  // toFormat("2022-04-03 12:20:49", "yy-mm-dd:hh-mi-se")
  toFormat = (date = new Date(), format) => {
    let result = '';
    const newDate = new Date(date);
    const yy = newDate.getFullYear();
    const mm =
      newDate.getMonth() + 1 < 10
        ? '0' + (newDate.getMonth() + 1)
        : newDate.getMonth() + 1;
    const dd =
      newDate.getDate() < 10 ? '0' + newDate.getDate() : newDate.getDate();
    const hh =
      newDate.getHours() < 10 ? '0' + newDate.getHours() : newDate.getHours();
    const mi =
      newDate.getMinutes() < 10
        ? '0' + newDate.getMinutes()
        : newDate.getMinutes();
    const se =
      newDate.getSeconds() < 10
        ? '0' + newDate.getSeconds()
        : newDate.getSeconds();
    const splitFormat = format.split(':');

    splitFormat.map((part, i) => {
      if (i === 1) {
        result = result + ' ';
      }
      part.split('-').map((item) => {
        if (result !== '') {
          if (['yy', 'mm', 'dd'].includes(item)) {
            result = result + '-';
          }
          if (['hh', 'mi', 'se'].includes(item)) {
            console.log(result.split('').splice(-1));
            if (result.split('').splice(-1)[0] !== ' ') {
              result = result + ':';
            }
          }
        }
        result = result + eval(item);
      });
    });
    return result;
  };

  async dbInsert(data) {
    const connection = this.knex.client.config.client;
    if (connection === 'oracledb') {
      const sql = this.knex(data.table);
      if (data.hasOwnProperty('return_column')) {
        sql.returning(data.return_column);
      }
      const result = await sql
        .insert(data.data_object)
        .catch((error) => this.knexErrorService.errorMessage(error.message));
      return result;
    } else if (connection === 'pg') {
      //
    }
  }

  async dbUpdate(data) {
    const connection = this.knex.client.config.client;
    if (connection === 'oracledb') {
      const sql = this.knex(data.table);
      if (data.hasOwnProperty('where')) {
        sql.where(data.where);
      }
      await sql
        .update(data.data_object)
        .catch((error) => this.knexErrorService.errorMessage(error.message));
    } else if (connection === 'pg') {
      //
    }
  }

  async dbDelete(data) {
    const connection = this.knex.client.config.client;
    if (connection === 'oracledb') {
      const sql = this.knex(data.table);
      if (data.hasOwnProperty('where')) {
        sql.where(data.where);
      }
      await sql
        .update(data.data_object)
        .catch((error) => this.knexErrorService.errorMessage(error.message));
    } else if (connection === 'pg') {
      //
    }
  }
}
