/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import * as currencyFormatter from 'currency-formatter';
import { env } from 'process';

const crypto = require('crypto');
const algorithm = 'aes-256-ctr';
const secretKey = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3';
const iv = '80e2af0a60ecbd16618abc72c2d00fb3';
@Injectable()
export default class Helpers {
  //get database formatted date from any date
  static mysql_date(date?: Date): any {
    //date = '2021-01-31 18:45:15'
    if (date) {
      return DateTime.fromJSDate(date).toUTC().toFormat('yyyy-MM-dd'); // "2014-09-08T08:02:17-05:00" (ISO 8601, no fractional seconds)
    } else {
      return DateTime.now().toUTC().toFormat('yyyy-MM-dd');
    }
  }
  static dateInView(date?: Date): any {
    if (date) {
      return DateTime.fromJSDate(date).toUTC().toFormat('DD'); // "2014-09-08T08:02:17-05:00" (ISO 8601, no fractional seconds)
    } else {
      return DateTime.now().toUTC().toFormat('DD');
    }
  }
  static dateTimeInView(date?: Date): any {
    if (date) {
      return DateTime.fromJSDate(date).toUTC().toFormat('FF'); // "2014-09-08T08:02:17-05:00" (ISO 8601, no fractional seconds)
    } else {
      return DateTime.now().toUTC().toFormat('FF');
    }
  }
  //get date time
  static mysql_datetime(date?: Date): any {
    //date = '2021-01-31 18:45:15'
    if (date) {
      return DateTime.fromJSDate(date).toUTC().toFormat('yyyy-MM-dd TT');
    } else {
      return new Date();
    }
  }

  //get year month
  static mysql_year_month(date?: Date): any {
    //date = '2021-01-31 18:45:15'
    if (date) {
      return DateTime.fromJSDate(date).toUTC().toFormat('yyyy-MM');
    } else {
      return DateTime.now().toUTC().toFormat('yyyy-MM');
    }
  }

  //get money formatter
  static money_format(money: number, currency = '') {
    const money_amount = money ?? 0;
    return currencyFormatter.format(money_amount, { code: currency });
  }

  //unformat money formatter
  static money_unformat(money: string, currency: string) {
    return currencyFormatter.unformat(money, { code: currency });
  }

  //get only time from a date time
  static toTimed(date?: Date): string {
    if (date) {
      return DateTime.fromJSDate(date).toUTC().toISOTime();
    } else {
      return DateTime.now().toUTC().toISOTime();
    }
  }

  //add hours with a date time
  static addHoursToDateTime(hours: number, datetime?: Date) {
    let dateTimeData = '';
    if (datetime) {
      dateTimeData = DateTime.fromJSDate(datetime)
        .plus({ hours: hours })
        .toFormat('yyyy-MM-dd TT');
    } else {
      dateTimeData = DateTime.now()
        .plus({ hours: hours })
        .toFormat('yyyy-MM-dd TT');
    }

    return dateTimeData;
  }
  //add minutes to a dateTIme
  static addMinutesToDateTime(minutes: number, datetime?: Date) {
    let dateTimeData = '';
    if (datetime) {
      dateTimeData = DateTime.fromJSDate(datetime)
        .toUTC()
        .plus({ minutes: minutes })
        .toFormat('yyyy-MM-dd TT');
    } else {
      dateTimeData = DateTime.now()
        .plus({ minutes: minutes })
        .toFormat('yyyy-MM-dd TT');
    }

    return dateTimeData;
  }

  static stringToArray(string) {
    const array = string.split(',');
    const new_array = [];
    for (const item of array) {
      new_array.push("'" + item + "'");
    }
    const return_array = new_array.join();
    return return_array;
  }

  static array_diff(arr1, arr2) {
    const diff = [];
    const joined = arr1.concat(arr2);
    for (let i = 0; i <= joined.length; i++) {
      const current = joined[i];
      if (
        joined.indexOf(current) == joined.lastIndexOf(current) &&
        typeof current !== 'undefined'
      ) {
        diff.push(current);
      }
    }
    return diff;
  }

  static dateCheck(value) {
    const date_exp =
      /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])([ ][0-9]{2}:[0-9]{2}:[0-9]{2})?$/;
    if (date_exp.test(value)) {
      return true;
    } else {
      return false;
    }
  }

  static arrayColumn = (arr, n) => arr.map((x) => x[n]);

  //encrypt url parameter
  static encrypt = (url) => {
    const cipher = crypto.createCipheriv(
      algorithm,
      secretKey,
      Buffer.from(iv, 'hex'),
    );
    const encrypted = Buffer.concat([cipher.update(url), cipher.final()]);
    return encrypted.toString('hex');
  };
  //decrypt url paramter
  static decrypt = (url) => {
    const decipher = crypto.createDecipheriv(
      algorithm,
      secretKey,
      Buffer.from(iv, 'hex'),
    );
    const decrpyted = Buffer.concat([
      decipher.update(Buffer.from(url, 'hex')),
      decipher.final(),
    ]);
    return env.NODE_ENV === 'production' ? decrpyted.toString() : url;
  };
}
