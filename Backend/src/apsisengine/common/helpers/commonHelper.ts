/**dependencies */
import { Inject, Injectable } from '@nestjs/common';
import { RedisCacheService } from 'src/apsisengine/cache';
import { SessionFilterService } from 'src/apsisengine/session-filter';
import { KNEX_CONNECTION } from 'src/knexmodule';
import { KnexErrorService } from '../knexerrors';
import Helpers from './apsisHelper';

@Injectable()
export default class CommonHelper {
  constructor(
    @Inject(KNEX_CONNECTION) private readonly knex,
    private readonly knexErrorService: KnexErrorService,
    private readonly redisCacheService: RedisCacheService,
    private readonly sessionFilterService: SessionFilterService,
  ) {}

  async sessionFilter(event_ref, slug, user_data, sql = '') {
    const userAccessKey = 'USER_ACCESS_' + user_data.user_id;
    const userGroupKey = 'GROUP_ACCESS_' + user_data.user_id;
    let query = '';
    //get redis cache session filter data
    let userAccessSession: any = await this.redisCacheService.get(
      userAccessKey,
    );
    let groupAccessSession: any = await this.redisCacheService.get(
      userGroupKey,
    );

    //check for redis data either fetch data from db
    if (!userAccessSession) {
      userAccessSession = await this.sessionFilterService.setUserFilterArray(
        user_data,
      );
    } else {
      userAccessSession = JSON.parse(userAccessSession);
    }
    if (!groupAccessSession) {
      groupAccessSession =
        await this.sessionFilterService.setPermissionFilterArray(user_data);
    } else {
      groupAccessSession = JSON.parse(groupAccessSession);
    }

    if (Object.keys(groupAccessSession).length > 0) {
      const search_options = groupAccessSession.hasOwnProperty(
        event_ref + '_' + slug,
      )
        ? groupAccessSession[event_ref + '_' + slug]
        : '';
      const user_search_options = userAccessSession.hasOwnProperty(
        event_ref + '_' + slug,
      )
        ? userAccessSession[event_ref + '_' + slug]
        : '';

      if (Object.keys(search_options).length > 0 && !user_search_options) {
        for (const [key, option] of Object.entries(search_options)) {
          let sql_where = '';
          if (option['sql_where_clause']) {
            const sql_wheretrims = option['sql_where_clause'].trim();
            sql_where = sql_wheretrims.replace(/^\AND+|\AND+$/g, '');
          }

          if (option['permission'].includes('%')) {
            const session_key = option['permission'].replace('%', '');
            query += ' AND ' + key + ' IN (' + user_data[session_key] + ')';
          } else {
            if (option['permission'] == 'All' && option['no_permission']) {
              query +=
                ' AND ' +
                key +
                ' NOT IN ("' +
                Helpers.stringToArray(option['no_permission']) +
                '")';
            } else if (
              option['permission'] == 'NoAccess' &&
              option['no_permission']
            ) {
              query +=
                ' AND ' +
                key +
                ' IN (' +
                Helpers.stringToArray(option['no_permission']) +
                ')';
            } else if (
              option['permission'].split(',').hasOwnProperty('NoAccess')
            ) {
              const per = option['permission'].split(',');
              const access = Helpers.array_diff(per, ['NoAccess']);
              const access2 = access.join();
              query +=
                ' AND ' + key + ' IN (' + Helpers.stringToArray(access2) + ')';
            } else if (option['permission'] && option['permission'] != 'All') {
              query +=
                ' AND ' +
                key +
                ' IN (' +
                Helpers.stringToArray(option['permission']) +
                ')';
            } else if (sql_where) {
              query += ' AND (sql_where)';
            }
          }
        }
      }
    }

    if (Object.keys(userAccessSession).length > 0) {
      const search_options = userAccessSession.hasOwnProperty(
        event_ref + '_' + slug,
      )
        ? userAccessSession[event_ref + '_' + slug]
        : '';

      if (Object.keys(search_options).length > 0) {
        for (const [key, option] of Object.entries(search_options)) {
          let sql_where = '';
          if (option['sql_where_clause']) {
            const sql_wheretrims = option['sql_where_clause'].trim();
            sql_where = sql_wheretrims.replace(/^\AND+|\AND+$/g, '');
          }

          if (option['permission'] == 'All' && option['no_permission']) {
            query +=
              ' AND ' +
              key +
              ' NOT IN ("' +
              Helpers.stringToArray(option['no_permission']) +
              '")';
          } else if (
            option['permission'] == 'NoAccess' &&
            option['no_permission']
          ) {
            query +=
              ' AND ' +
              key +
              ' IN (' +
              Helpers.stringToArray(option['no_permission']) +
              ')';
          } else if (
            option['permission'].split(',').hasOwnProperty('NoAccess')
          ) {
            const per = option['permission'].split(',');
            const access = Helpers.array_diff(per, ['NoAccess']);
            const access2 = access.join();
            query +=
              ' AND ' + key + ' IN (' + Helpers.stringToArray(access2) + ')';
          } else if (option['permission'] && option['permission'] != 'All') {
            query +=
              ' AND ' +
              key +
              ' IN (' +
              Helpers.stringToArray(option['permission']) +
              ')';
          } else if (sql_where) {
            query += ' AND (sql_where)';
          }
        }
      }
    }

    const sessionFilter = query;

    let sqlstring = '';
    if (sessionFilter) {
      const sessionFilter2 = sessionFilter.trim();
      const sessionFilter3 =
        ' WHERE ' + sessionFilter2.replace(/^\AND+|\AND+$/g, '') + ' AND ';

      const sql2 = sql.trim();

      const sql3 = sql2.replace(/^\AND+|\AND+$/g, '');

      if (sql3.includes('where')) {
        const needle = 'where';
        const lastIndex = sql3.lastIndexOf(needle);
        sqlstring =
          sql3.substring(0, lastIndex) +
          sessionFilter3 +
          sql3.substring(lastIndex + needle.length);
        //sqlstring = sql3.replace('where', sessionFilter3);
      } else if (sql3.includes('WHERE')) {
        const needle = 'WHERE';
        const lastIndex = sql3.lastIndexOf(needle);
        sqlstring =
          sql3.substring(0, lastIndex) +
          sessionFilter3 +
          sql3.substring(lastIndex + needle.length);
        //sqlstring = sql3.replace('WHERE', sessionFilter3);
      } else {
        const sessionFilter2 = sessionFilter.trim();
        const sessionFilter3 = sessionFilter2.replace(/^\AND+|\AND+$/g, '');
        sqlstring = sql3 + ' ' + sessionFilter3;
      }
    } else {
      sqlstring = sql;
    }

    if (sqlstring == '') {
      sqlstring = 'WHERE 1';
    }

    if (event_ref == 'url') {
      const rpstring1 = sqlstring.replace('where', '');
      const rpstring2 = rpstring1.replace('WHERE', '');
      const ltrim1 = rpstring2.replace(/^where/gi, '');
      const ltrim2 = ltrim1.replace(/^WHERE/gi, '');
      sqlstring = ltrim2.trim();
    }
    return sqlstring;
  }

  async columnArray(selectSql) {
    const colArray = [];
    selectSql
      .toLowerCase()
      .replace('select', '')
      .replace(/(\r\n\t|\n|\r|\t)/g, '')
      .split(',')
      .map((col) => {
        const myArray =
          col.includes(' as ') === true ? col.split(' as ') : col.split('.');
        if (myArray[1]) {
          colArray.push(myArray[1].replace(/['"]+/g, ''));
        } else {
          colArray.push(myArray[0].replace(/['"]+/g, ''));
        }
      });
    return colArray;
  }

  async planeExtraCondition(extra_condition: string) {
    const keywords = [
      'like',
      'in',
      'and',
      'or',
      'where',
      'select',
      'join',
      '(',
      ')',
      ',',
      'from',
      '=',
      '!=',
      '<>',
      'null',
      'between',
      'not',
      'is',
      '||',
    ];
    const extra_array = extra_condition.split(' ');
    const filter_array = [];
    extra_array.map((item) => {
      if (!keywords.includes(item.toLowerCase())) {
        if (!item.toLocaleLowerCase().includes('like')) {
          if (
            item.includes('0') ||
            item.includes('1') ||
            item.includes('2') ||
            item.includes('3') ||
            item.includes('4') ||
            item.includes('5') ||
            item.includes('6') ||
            item.includes('7') ||
            item.includes('8') ||
            item.includes('9') ||
            item.includes(`'`)
          ) {
            filter_array.push(item);
          } else {
            item = `"${item}"`;
            let tableOrColumnName = '';
            for (let i = 0; i < item.length; i++) {
              if (item[i] === '.') {
                tableOrColumnName += `"."`;
              } else {
                tableOrColumnName += item[i];
              }
            }
            filter_array.push(tableOrColumnName);
          }
        } else {
          filter_array.push(item);
        }
      } else {
        filter_array.push(item);
      }
    });
    const plainSQL = filter_array.join(' ');
    return plainSQL;
  }
}
