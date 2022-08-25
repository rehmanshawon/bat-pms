import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { KNEX_CONNECTION } from 'src/knexmodule';
import { RedisCacheService } from '../cache';
import { KnexErrorService } from '../common/knexerrors';
import { DelegationService } from '../delegation/index';
import { SessionFilterService } from '../session-filter';
import CommonHelper from '../common/helpers/commonHelper';
import { CreateMastergridDto } from './dto/mastergridCreateDto';
import { generateXlsx } from '../common/helpers/generateXLsxHelper';
import Helpers from '../common/helpers/apsisHelper';
import { DeleteMasterGridDto } from './dto/masterGridDeleteDto';

@Injectable()
export class MasterGridService {
  constructor(
    @Inject(KNEX_CONNECTION) private readonly knex,
    private readonly knexErrorService: KnexErrorService,
    private readonly redisCacheService: RedisCacheService,
    private readonly sessionFilterService: SessionFilterService,
    private readonly delegationService: DelegationService,
    private readonly commonHelper: CommonHelper,
  ) {}

  async gridData(req_data, user_data) {
    //const company_id = 1;
    const slug = req_data['slug'];
    const extra_data = req_data['extra'] ? req_data['extra'] : {};

    const grid_info = await this.knex('sys_master_grids')
      .where('master_grid_slug', slug)
      .where('company_id', user_data.company_id)
      .first()
      .catch((error) => this.knexErrorService.errorMessage(error.message));
    const sqlcondition = await this.commonHelper.sessionFilter(
      'sys_master_grid',
      slug,
      user_data,
      grid_info.sql_condition,
    );

    // const sqlcondition = await this.sessionFilter(
    //   'sys_master_grid',
    //   slug,
    //   user_data,
    //   grid_info.sql_condition,
    // );

    req_data['master_grid_slug'] = grid_info.master_grid_slug;
    req_data['sql_select'] = grid_info.sql_select;
    req_data['sql_source'] = grid_info.sql_source;
    req_data['sql_condition'] = sqlcondition;
    req_data['sql_group_by'] = grid_info.sql_group_by;
    req_data['sql_having'] = grid_info.sql_having;
    req_data['sql_order_by'] = req_data['order_by']
      ? req_data['order_by']
      : grid_info.sql_order_by;
    req_data['search_columns'] = grid_info.search_columns;
    //return req_data;
    const datatable_condition = await this.dropDownQueryGenerator(
      req_data,
      user_data,
    );

    const where_condition = datatable_condition['where_con'];
    let having_condition = '';
    if (grid_info.sqlhaving) {
      having_condition =
        grid_info.sqlhaving +
        '' +
        datatable_condition['having_con'].replace('HAVING', ' AND');
    } else {
      having_condition = datatable_condition['having_con'];
    }

    req_data['where_condition'] = where_condition;
    req_data['having_condition'] = having_condition;

    const query = await this.sqlQueryConcat(req_data, extra_data, user_data);
    //return extra_data;
    let datatable_query = '';
    if (req_data['per_page']) {
      datatable_query =
        query +
        ' LIMIT ' +
        req_data['per_page'] +
        ' OFFSET ' +
        (req_data['per_page'] * req_data['page'] - req_data['per_page']);
    } else {
      datatable_query = query;
    }
    console.log(datatable_query);
    const rows = await this.knex.raw(datatable_query);
    const linkable_column = await this.dataLinkCheck(grid_info.data_link);

    const button_info = await this.buttonInfo(slug);

    //const button_info = {};
    //return button_info;
    //const data_link = [];
    const data_array = [];
    //return rows[0];
    const self = this;

    if (rows.rows) {
      for (const row of rows.rows) {
        const cel_array = {};
        for (const [k, v] of Object.entries(row)) {
          const rawCellValue = {
            key: k,
            value: v,
          };

          //const value = await self.formatingCellValue(rawCellValue);
          const value = v;
          if (linkable_column.includes(k)) {
            const linkurlRawData = {
              data_link: grid_info.data_link,
              key_value: row,
              key: k,
            };
            const route = await self.linkUrl(linkurlRawData);
            cel_array[k] = {
              value: value,
              link: route,
            };
          } else {
            cel_array[k] = value;
          }
        }
        const status_field = grid_info.status_field;
        cel_array['action'] = {
          buttons: await self.visibleButton(button_info, row[status_field]),
        };

        data_array.push(cel_array);
      }
    }
    const result_array = {
      page: req_data['page'] ? req_data['page'] : null,
      per_page: req_data['per_page'] ? req_data['per_page'] : null,
      items: data_array,
    };

    if (req_data['page']) {
      return result_array;
    } else {
      return data_array;
    }
  }

  async dropDownQueryGenerator(req_data, user_data) {
    const grid_slug = req_data['master_grid_slug'];

    let sqlcondition = await this.commonHelper.sessionFilter(
      'sys_master_grid',
      grid_slug,
      user_data,
      req_data['sql_condition'],
    );
    // let sqlcondition = await this.sessionFilter(
    //   'sys_master_grid',
    //   grid_slug,
    //   user_data,
    //   req_data['sql_condition'],
    // );

    let table_search =
      typeof req_data['search'] != 'undefined' &&
      typeof req_data['search']['value'] != 'undefined'
        ? req_data['search']['value']
        : '';

    if (req_data.hasOwnProperty('search_key')) {
      if (req_data['search_key'].hasOwnProperty('search_text')) {
        table_search = req_data['search_key']['search_text'];
      }
    }

    //const search_options = [];
    let search_columns = [];
    if (req_data['search_columns']) {
      search_columns = req_data['search_columns'].split(',');
    } else {
      let groupBy = '';
      if (req_data['sql_group_by']) {
        groupBy = req_data['sql_group_by'] + ' ';
      }
      const all_field_query = await this.knex.raw(
        req_data['sql_select'] +
          ' ' +
          req_data['sql_source'] +
          ' ' +
          groupBy +
          'LIMIT 1',
      );

      const all_field =
        typeof all_field_query[0] !== 'undefined' ? all_field_query[0][0] : [];

      //const search_columns = [];
      if (all_field) {
        for (const [key, option] of Object.entries(all_field)) {
          search_columns.push(key);
        }
      }
    }

    const custom_search =
      typeof req_data['search_data'] !== 'undefined'
        ? req_data['search_data']
        : '';
    const custom_search_con = await this.customSearch(custom_search);
    let custom_search_con_hv = [];
    let custom_search_con_wh = [];
    const exceptional_case = [];
    let wherecon = '';
    let havingcon = '';
    const between_case_wh = [];

    if (typeof custom_search_con['WH'] !== 'undefined') {
      custom_search_con_wh = custom_search_con['WH'];
      for (const [key_name, value] of Object.entries(custom_search_con_wh)) {
        const exceptional_keys = ['_start', '_end', '_condition'];
        exceptional_keys.forEach(function (key) {
          if (key_name.indexOf(key) > 0) {
            const item_key = key_name.substr(0, key_name.indexOf(key));
            between_case_wh[item_key][key.replace(/^\_+|\_+$/g, '')] = value;
            delete custom_search_con_wh[key_name];
          }
        });

        if (key_name.indexOf('notable') === 0) {
          const item_key = key_name.replace(/^[notable]+|[notable]+$/g, '');
          exceptional_case[item_key] = value;
          delete custom_search_con_wh[key_name];
        }
      }
      wherecon += await this.betweenCondition(between_case_wh);
    }

    const between_case_hv = [];
    if (typeof custom_search_con['HV'] !== 'undefined') {
      custom_search_con_hv = custom_search_con['HV'];
      for (const [key_name, value] of Object.entries(custom_search_con_hv)) {
        const exceptional_keys = ['_start', '_end', '_condition', 'rangetype-'];
        exceptional_keys.forEach(function (key) {
          if (key_name.indexOf(key) > 0) {
            const item_key = key_name.substr(0, key_name.indexOf(key));
            between_case_hv[item_key][key.replace(/^\_+|\_+$/g, '')] = value;
            delete custom_search_con_hv[key_name];
          }
        });
      }
      havingcon += this.betweenCondition(between_case_hv);
    }

    if (custom_search_con) {
      wherecon += await this.customSearchFormatter(custom_search_con_wh);
      havingcon += await this.customSearchFormatter(custom_search_con_hv);
    }
    let having_from_search = '';
    if (table_search && search_columns.length > 0) {
      //const table_search_like = table_search.toLowerCase();

      for (const [i, column] of Object.entries(search_columns)) {
        const columnLower = column.toLowerCase();
        if (i == '0') {
          having_from_search +=
            columnLower + "::text ILIKE '%" + table_search + "%'";
        } else {
          having_from_search +=
            ' OR ' + columnLower + "::text ILIKE '%" + table_search + "%'";
        }
      }
    }

    if (wherecon.trim() != '') {
      wherecon = wherecon.trim().replace('AND', '');
      sqlcondition = sqlcondition + ' AND ' + wherecon;
    }

    if (havingcon.trim() != '') {
      havingcon = havingcon.trim().replace('AND', '');
      havingcon = having_from_search
        ? ' HAVING ' + havingcon + ' AND (' + having_from_search + ')'
        : 'HAVING ' + havingcon;
    } else {
      if (having_from_search) {
        havingcon = ' HAVING ' + having_from_search;
      }
    }

    const conditions = {
      where_con: sqlcondition,
      having_con: havingcon,
    };

    return conditions;
  }

  // async sessionFilter(event_ref, slug, user_data, sql = '') {
  //   const userAccessKey = 'USER_ACCESS_' + user_data.user_id;
  //   const userGroupKey = 'GROUP_ACCESS_' + user_data.user_id;
  //   let query = '';
  //   //get redis cache session filter data
  //   let userAccessSession: any = await this.redisCacheService.get(
  //     userAccessKey,
  //   );
  //   let groupAccessSession: any = await this.redisCacheService.get(
  //     userGroupKey,
  //   );
  //   //check for redis data either fetch data from db
  //   if (!userAccessSession) {
  //     userAccessSession = await this.sessionFilterService.setUserFilterArray(
  //       user_data,
  //     );
  //   } else {
  //     userAccessSession = JSON.parse(userAccessSession);
  //   }
  //   if (!groupAccessSession) {
  //     groupAccessSession =
  //       await this.sessionFilterService.setPermissionFilterArray(user_data);
  //   } else {
  //     groupAccessSession = JSON.parse(groupAccessSession);
  //   }

  //   if (Object.keys(groupAccessSession).length > 0) {
  //     const search_options = groupAccessSession.hasOwnProperty(
  //       event_ref + '_' + slug,
  //     )
  //       ? groupAccessSession[event_ref + '_' + slug]
  //       : '';
  //     const user_search_options = userAccessSession.hasOwnProperty(
  //       event_ref + '_' + slug,
  //     )
  //       ? userAccessSession[event_ref + '_' + slug]
  //       : '';

  //     if (Object.keys(search_options).length > 0 && !user_search_options) {
  //       for (const [key, option] of Object.entries(search_options)) {
  //         let sql_where = '';
  //         if (option['sql_where_clause']) {
  //           const sql_wheretrims = option['sql_where_clause'].trim();
  //           sql_where = sql_wheretrims.replace(/^\AND+|\AND+$/g, '');
  //         }

  //         if (option['permission'].includes('%')) {
  //           const session_key = option['permission'].replace('%', '');
  //           query += ' AND ' + key + ' IN (' + user_data[session_key] + ')';
  //         } else {
  //           if (option['permission'] == 'All' && option['no_permission']) {
  //             query +=
  //               ' AND ' +
  //               key +
  //               ' NOT IN ("' +
  //               Helpers.stringToArray(option['no_permission']) +
  //               '")';
  //           } else if (
  //             option['permission'] == 'NoAccess' &&
  //             option['no_permission']
  //           ) {
  //             query +=
  //               ' AND ' +
  //               key +
  //               ' IN (' +
  //               Helpers.stringToArray(option['no_permission']) +
  //               ')';
  //           } else if (
  //             option['permission'].split(',').hasOwnProperty('NoAccess')
  //           ) {
  //             const per = option['permission'].split(',');
  //             const access = Helpers.array_diff(per, ['NoAccess']);
  //             const access2 = access.join();
  //             query +=
  //               ' AND ' + key + ' IN (' + Helpers.stringToArray(access2) + ')';
  //           } else if (option['permission'] && option['permission'] != 'All') {
  //             query +=
  //               ' AND ' +
  //               key +
  //               ' IN (' +
  //               Helpers.stringToArray(option['permission']) +
  //               ')';
  //           } else if (sql_where) {
  //             query += ' AND (sql_where)';
  //           }
  //         }
  //       }
  //     }
  //   }

  //   if (Object.keys(userAccessSession).length > 0) {
  //     const search_options = userAccessSession.hasOwnProperty(
  //       event_ref + '_' + slug,
  //     )
  //       ? userAccessSession[event_ref + '_' + slug]
  //       : '';

  //     if (Object.keys(search_options).length > 0) {
  //       for (const [key, option] of Object.entries(search_options)) {
  //         let sql_where = '';
  //         if (option['sql_where_clause']) {
  //           const sql_wheretrims = option['sql_where_clause'].trim();
  //           sql_where = sql_wheretrims.replace(/^\AND+|\AND+$/g, '');
  //         }

  //         if (option['permission'] == 'All' && option['no_permission']) {
  //           query +=
  //             ' AND ' +
  //             key +
  //             ' NOT IN ("' +
  //             Helpers.stringToArray(option['no_permission']) +
  //             '")';
  //         } else if (
  //           option['permission'] == 'NoAccess' &&
  //           option['no_permission']
  //         ) {
  //           query +=
  //             ' AND ' +
  //             key +
  //             ' IN (' +
  //             Helpers.stringToArray(option['no_permission']) +
  //             ')';
  //         } else if (
  //           option['permission'].split(',').hasOwnProperty('NoAccess')
  //         ) {
  //           const per = option['permission'].split(',');
  //           const access = Helpers.array_diff(per, ['NoAccess']);
  //           const access2 = access.join();
  //           query +=
  //             ' AND ' + key + ' IN (' + Helpers.stringToArray(access2) + ')';
  //         } else if (option['permission'] && option['permission'] != 'All') {
  //           query +=
  //             ' AND ' +
  //             key +
  //             ' IN (' +
  //             Helpers.stringToArray(option['permission']) +
  //             ')';
  //         } else if (sql_where) {
  //           query += ' AND (sql_where)';
  //         }
  //       }
  //     }
  //   }

  //   const sessionFilter = query;

  //   let sqlstring = '';
  //   if (sessionFilter) {
  //     const sessionFilter2 = sessionFilter.trim();
  //     const sessionFilter3 =
  //       ' WHERE ' + sessionFilter2.replace(/^\AND+|\AND+$/g, '') + ' AND ';

  //     const sql2 = sql.trim();

  //     const sql3 = sql2.replace(/^\AND+|\AND+$/g, '');
  //     const sql4 = sql3.toLowerCase();

  //     if (sql4.includes('where')) {
  //       sqlstring = sql4.replace('where', sessionFilter3.toLowerCase());
  //     } else {
  //       const sessionFilter2 = sessionFilter.trim();
  //       const sessionFilter3 = sessionFilter2.replace(/^\AND+|\AND+$/g, '');
  //       sqlstring = sql4 + ' ' + sessionFilter3;
  //     }
  //   } else {
  //     sqlstring = sql;
  //   }

  //   if (sqlstring == '') {
  //     sqlstring = 'WHERE 1';
  //   }

  //   if (event_ref == 'url') {
  //     const rpstring1 = sqlstring.replace('where', '');
  //     const rpstring2 = rpstring1.replace('WHERE', '');
  //     const ltrim1 = rpstring2.replace(/^where/gi, '');
  //     const ltrim2 = ltrim1.replace(/^WHERE/gi, '');
  //     sqlstring = ltrim2.trim();
  //   }
  //   return sqlstring;
  // }

  async customSearch(custom_search) {
    const searchArray = [];
    if (Object.keys(custom_search).length) {
      //custom_search.forEach(function (cust_src) {
      for (const cust_src of custom_search) {
        //if (Object.keys(cust_src['value']).length) {
        let value = cust_src['value'];
        const plain_name = cust_src['name'].replace('[]', '');
        if (plain_name == 'tagged_account') {
          const cust_src_type = 'WH';
          const tag_key_value = cust_src['value'].split('-');
          const name = tag_key_value[0];
          value = tag_key_value[1];
          //searchArray[cust_src_type]['tagg'][name] = value;

          const cst = {};
          cst[cust_src_type] = {
            tag: {
              [name]: value,
            },
          };
          searchArray.push(cst);
        } else {
          //const cust_src_type = substr(cust_src['name'], 0, 3).replace(/^([-]*)/g, '').replace(/([-]*)/g, '');
          const cust_src_type = cust_src['name']
            .substr(0, 3)
            .replace(/^([-]*)/g, '')
            .replace(/([-]*)/g, '');
          //const name = substr($cust_src['name'], 3).trim();
          const name = cust_src['name'].substr(3).trim();
          if (cust_src['name'].indexOf('[]') > 0) {
            name.replace(/[[]]/g, '');
          }
          // const cst = {};
          // cst[cust_src_type][name] = value;
          // searchArray.push(cst);
          if (searchArray[cust_src_type] === undefined)
            searchArray[cust_src_type] = [];
          if (searchArray[cust_src_type][name] === undefined)
            searchArray[cust_src_type][name] = value;
        }
        // }
      } //);
    }
    return searchArray;
  }

  async betweenCondition(data) {
    let between_condition = '';
    for (const [key, item] of Object.entries(data)) {
      const col_name = key.substr(3);
      const condition = item['condition'][0] ? item['condition'][0] : '';
      const start = item['start'][0] ? item['start'][0] : '';
      const end = item['end'][0] ? item['end'][0] : '';

      if (condition == 'between' && end != '') {
        between_condition +=
          ' AND ' + col_name + ' BETWEEN ' + start + ' AND ' + end + ' ';
      } else if (end != '') {
        between_condition +=
          ' AND ' + col_name + ' ' + condition + ' ' + end + ' ';
      }
    }
    return between_condition;
  }

  async customSearchFormatter(custom_search_con) {
    let con = '';
    for (const [name, value] of Object.entries(custom_search_con)) {
      const cust_src_con = name
        .substr(0, 3)
        .replace(/^([-]*)/g, '')
        .replace(/([-]*)/g, '');
      const col_name1 = name.substr(3);
      const col_name = col_name1.replace(/[[]]/g, '');
      if (name == 'tagg') {
        con += ' AND (';
        let tag_inc = 0;

        for (const [tagg_key, tagg_value] of Object.entries(value)) {
          if (tag_inc == 0) {
            con +=
              " (acc_voucher_tag_details.voucher_reference_name='" +
              tagg_key +
              "' AND acc_voucher_tag_details.voucher_reference_id=" +
              tagg_value[0] +
              ')';
          } else {
            con +=
              " OR (acc_voucher_tag_details.voucher_reference_name='" +
              tagg_key +
              "' AND acc_voucher_tag_details.voucher_reference_id=" +
              tagg_value[0] +
              ')';
          }
          tag_inc++;
        }
        con += ')';
      } else {
        //let useVal = {};
        if (cust_src_con == 'IN') {
          const useVal = value.toString();
          con += ' AND col_name IN (useVal)';
        } else if (cust_src_con == 'DR') {
          const useVal = value.toString();
          //date_range = explode(' - ', $value);
          const date_range = useVal.split(' - ');

          if (date_range.length > 1) {
            const date1raw = new Date(date_range[0]);
            const date2raw = new Date(date_range[1]);
            const dd1 = String(date1raw.getDate()).padStart(2, '0');
            const mm1 = String(date1raw.getMonth() + 1).padStart(2, '0');
            const yyyy1 = date1raw.getFullYear();
            // yy = yyyy.toString().substr(-2);

            const dd2 = String(date2raw.getDate()).padStart(2, '0');
            const mm2 = String(date2raw.getMonth() + 1).padStart(2, '0');
            const yyyy2 = date2raw.getFullYear();
            // yy = yyyy.toString().substr(-2);

            const date1 = yyyy1 + '-' + mm1 + '-' + dd1;
            const date2 = yyyy2 + '-' + mm2 + '-' + dd2;
            con +=
              ' AND ' +
              col_name +
              " BETWEEN '" +
              date1 +
              "' AND '" +
              date2 +
              "'";
          }
        } else if (cust_src_con == 'LK') {
          const useVal = value.toString();
          if (useVal) {
            if (Helpers.dateCheck(useVal)) {
              con += ' AND ' + col_name + '::text LIKE ' + "'%" + useVal + "%'";
            } else {
              con += ' AND ' + col_name + ' LIKE ' + "'%" + useVal + "%'";
            }
          }
        } else if (cust_src_con == 'EQ') {
          //$value = "'".implode("','" , $value)."'";
          const useVal = value.toString();
          if (useVal) {
            con += ' AND ' + col_name + " = '" + useVal + "'";
          }
        } else if (cust_src_con == 'RG') {
          //$value = "'".implode("','" , $value)."'";
          const useVal = value.toString();
          con += ' AND ' + col_name + " = '" + useVal + "'";
        } else if (cust_src_con == 'TM') {
          //$value = "'".implode("','" , $value)."'";
          const useVal = value.toString();
          con +=
            ' AND DATE_FORMAT(' + col_name + ",'%h:%i%p') = '" + useVal + "'";
        } else {
          //$value = "'".implode("','" , $value)."'";
          const useVal = value.toString();
          con += ' AND ' + name + ' IN (' + useVal + ')';
        }
      }
    }
    return con;
  }

  async sqlQueryConcat(data, extra_con, user_data) {
    const grid_slug = data['master_grid_slug'];
    const sqltext = data['sql_select'] ? data['sql_select'] : '';
    const sqlsource = data['sql_source'] ? data['sql_source'] : '';
    const sqlcondition = data['sql_condition'] ? data['sql_condition'] : '';
    const sqlgroupby = data['sql_group_by'] ? data['sql_group_by'] : '';
    const sqlorderby = data['sql_order_by'] ? data['sql_order_by'] : '';
    const sqlhaving = data['sql_having'] ? data['sql_having'] : '';
    let having_condition = data['having_condition']
      ? data['having_condition']
      : '';
    if (sqlhaving) {
      having_condition =
        sqlhaving + '' + having_condition.replace('HAVING', ' AND ');
    }
    let where_condition = data['where_condition']
      ? data['where_condition']
      : sqlcondition;

    //return extra_con;
    if (
      extra_con.hasOwnProperty('extra_condition') &&
      extra_con.extra_condition
    ) {
      //if (typeof extra_con !== 'undefined' && extra_con !== null) {
      if (where_condition) {
        where_condition += ' AND ' + extra_con['extra_condition'];
      } else {
        where_condition += 'WHERE ' + extra_con['extra_condition'];
      }
    }

    let sql_query2 = '';
    if (extra_con.hasOwnProperty('slug') && extra_con.slug !== '') {
      const id_logic = await this.delegationService.idManagerInfo(
        extra_con.slug,
        user_data.company_id,
      );

      const sqlsource_for_del =
        sqlsource +
        ' LEFT JOIN sys_delegation_columns ON sys_delegation_columns.table_field_value = ' +
        id_logic.ref_db_table_name +
        '.' +
        id_logic.ref_id_field +
        "::VARCHAR AND sys_delegation_columns.table_name ='" +
        id_logic.ref_db_table_name +
        "'";

      const sql_query =
        sqltext +
        ' ' +
        sqlsource_for_del +
        ' ' +
        where_condition +
        ' AND sys_delegation_columns.delegation_reliever_id = ' +
        user_data.user_id +
        ' AND ' +
        id_logic.ref_db_table_name +
        '.' +
        id_logic.ref_status_field +
        '=' +
        id_logic.initiate_approve_status +
        ' ' +
        sqlgroupby +
        ' ' +
        having_condition +
        ' ' +
        sqlorderby;
      let same_sort_sqltext = data['sql_select']
        ? data['sql_select'] + ' '
        : '';
      //same_sort_sqltext += data['sql_source'] ? data['sql_source'] : '';
      same_sort_sqltext += sqlsource_for_del;
      same_sort_sqltext +=
        ' LEFT JOIN sys_delegation_conf sdc ON sdc.delegation_for=sys_delegation_columns.delegation_for AND sdc.ref_event_id=sys_delegation_columns.delegation_ref_event_id AND sdc.delegation_version=sys_delegation_columns.delegation_version AND sdc.step_number=sys_delegation_columns.delegation_step AND sdc.same_sort=1 AND sdc.user_id=' +
        user_data.user_id;
      same_sort_sqltext += data['sql_condition']
        ? ' ' + data['sql_condition']
        : ' WHERE 1 ';
      same_sort_sqltext +=
        ' AND ' +
        id_logic.ref_db_table_name +
        '.' +
        id_logic.ref_id_field +
        '::VARCHAR NOT IN (select ref_id from sys_delegation_historys where sys_delegation_historys.ref_id=' +
        id_logic.ref_db_table_name +
        '.' +
        id_logic.ref_id_field +
        "::VARCHAR AND sys_delegation_historys.step_no=sys_delegation_columns.delegation_step AND sys_delegation_historys.delegation_decline_count=sys_delegation_columns.delegation_decline_count AND sys_delegation_historys.ref_event='" +
        id_logic.slug +
        "' AND sys_delegation_historys.delegation_reliever_id=" +
        user_data.user_id +
        ')';
      same_sort_sqltext += ' AND sdc.user_id=' + user_data.user_id;
      same_sort_sqltext +=
        ' AND ' +
        id_logic.ref_db_table_name +
        '.' +
        id_logic.ref_status_field +
        '=' +
        id_logic.initiate_approve_status;
      same_sort_sqltext +=
        ' AND sys_delegation_columns.delegation_step IS NOT NULL';
      same_sort_sqltext +=
        ' AND sys_delegation_columns.delegation_reliever_id IS NULL';

      if (sqlgroupby) {
        same_sort_sqltext += ' ' + sqlgroupby;
      }
      if (having_condition) {
        same_sort_sqltext += ' ' + having_condition;
      }

      const session_one = await this.commonHelper.sessionFilter(
        'sys_master_grid',
        grid_slug,
        user_data,
        sql_query,
      );

      const session_two = await this.commonHelper.sessionFilter(
        'sys_master_grid',
        grid_slug,
        user_data,
        same_sort_sqltext,
      );
      sql_query2 = '(' + session_one + ') UNION ALL (' + session_two + ')';
    } else {
      const sql_query1 =
        sqltext +
        ' ' +
        sqlsource +
        ' ' +
        where_condition +
        ' ' +
        sqlgroupby +
        ' ' +
        having_condition +
        ' ' +
        sqlorderby;

      sql_query2 = await this.commonHelper.sessionFilter(
        'sys_master_grid',
        grid_slug,
        user_data,
        sql_query1,
      );
    }
    let sql_query3 = sql_query2.replace('\\', '');
    //if (typeof extra_con !== 'undefined') {
    if (extra_con.hasOwnProperty('sql_replace')) {
      let valValue: any = '';
      for (const [key, value] of Object.entries(extra_con['sql_replace'])) {
        const keyVal = '@' + key;
        valValue = value;
        sql_query3 = sql_query3.replace(keyVal, valValue);
      }
    }
    return sql_query3;
  }

  async dataLinkCheck(data) {
    if (data) {
      const column_link = data.split(',');
      const column_array = [];

      column_link.forEach(function (cl) {
        const cl_array = cl.split(':');
        column_array.push(cl_array[0]);
      });

      return column_array;
    } else {
      return [];
    }
  }

  async buttonInfo(slug) {
    const data = await this.knex('sys_action_buttons')
      .select(
        'btn_name',
        'btn_type',
        'route_link',
        'btn_class',
        'btn_id',
        'btn_order',
        'btn_icon',
        'btn_slug',
        'always_show',
        'in_dropdown',
        'enable_status',
        'disable_status',
        'enable_multiple',
      )
      .where('grid_slug', slug)
      .orderBy('btn_order', 'ASC')
      .catch((error) => this.knexErrorService.errorMessage(error.message));
    return data;
  }

  async formatingCellValue(data) {
    const flag = data['key'].split('_');

    let raw_value: any = '';

    let value = '';
    // const date_exp =
    //   /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])([ ][0-9]{2}:[0-9]{2}:[0-9]{2})?$/;
    const date_exp =
      /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])([ ][0-9]{2}:[0-9]{2}:[0-9]{2})?$/;

    if (date_exp.test(data['value'])) {
      raw_value = Helpers.mysql_datetime(new Date(data['value'])).toString();
      //console.log(raw_value+'one');
      //const raw_value = Helpers.mysql_datetime(ttt).toString();
    } else {
      raw_value = Helpers.mysql_datetime(data['value']).toString();
      //console.log(raw_value+'two');
    }
    //console.log(date_exp.test(raw_value));
    if (flag[0] == 'apsisamt') {
      //value = datatable_moneyFormat($data['value']);
      value = data['value'];
      //}else if (preg_match("/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])([ ][0-9]{2}:[0-9]{2}:[0-9]{2})?$/",$data['value'])) {
    } else if (date_exp.test(raw_value) && data['value']) {
      //console.log(raw_value+'@'+data['value']);
      //console.log(data['value']);
      const datecheck = raw_value.split(' ');
      if (datecheck[1]) {
        const time_array = datecheck[1].split(':');
        if (parseInt(time_array[0]) > 0) {
          //console.log(4444);
          //console.log(raw_value);
          //$value = toDateTimed($data['value']);
          value = Helpers.dateTimeInView(data['value']);
        } else {
          //console.log(22222);
          //$value = toDated($data['value']);
          value = Helpers.dateInView(new Date(data['value']));
        }
      } else {
        const timecheck = datecheck[0].split('-');
        if (timecheck[1]) {
          //$value = toDated($data['value']);
          //console.log(3);
          value = Helpers.dateInView(new Date(data['value']));
        } else {
          //$value = toTimed($data['value']);
          value = Helpers.toTimed(raw_value);
        }
      }
    } else {
      value = data['value'];
    }
    return value;
  }

  async linkUrl(data) {
    let data_link_route = '';
    const link_string_comma = data['data_link'].split(',');
    link_string_comma.forEach(function (lsc) {
      const link_string_colon = lsc.split(':');
      if (link_string_colon[0] === data['key']) {
        data_link_route = link_string_colon[1];
      }
    });

    const data_link_explode = data_link_route.split('/');

    let route = '';
    let cleanitem = '';
    data_link_explode.forEach(function (item) {
      if (item.substr(0, 1) === '@') {
        cleanitem = item.replace('@', '');
        //console.log(cleanitem);
        const route_string = cleanitem.replace(
          cleanitem,
          data['key_value'][cleanitem],
        );
        route += route_string + '/';
      } else {
        route += item + '/';
      }
    });
    return route;
  }

  async visibleButton(button_info, status) {
    let buttons = '';

    button_info.forEach(function (item) {
      let disable_status = [];
      if (item.disable_status) {
        disable_status = item.disable_status.split(',');
      }
      let enable_status = [];
      if (item.enable_status) {
        enable_status = item.enable_status.split(',');
      }

      if (
        status &&
        !disable_status.includes(status.toString()) &&
        enable_status.includes(status.toString())
      ) {
        buttons += item.btn_name + ',';
      } else if (!item.disable_status && !item.enable_status) {
        buttons += item.btn_name + ',';
      }
    });

    const buttons_str = buttons.replace(/,\s*$/, '');
    return buttons_str;
  }

  async gridtitle(req_data, user_data) {
    const slug = req_data.slug;
    const extra_data = req_data.extra ? req_data.extra : {};
    const title = extra_data.hasOwnProperty('title') ? extra_data['title'] : [];
    //const req_data: { [x: string]: string | string[] } = {};
    req_data['slug'] = req_data.slug;
    req_data['extra'] = req_data.extra;
    const grid_info = await this.knex('sys_master_grids')
      .where('master_grid_slug', slug)
      .where('company_id', user_data.company_id)
      .first()
      .catch((error) => this.knexErrorService.errorMessage(error.message));

    const sqlcondition = await this.commonHelper.sessionFilter(
      'sys_master_grid',
      slug,
      user_data,
      grid_info.sql_condition,
    );

    //$sqlcondition = sessionFilter('sys_master_grid', $slug, user_data, $grid_info->sqlcondition);

    req_data['master_grid_slug'] = grid_info.master_grid_slug;
    req_data['sql_select'] = grid_info.sql_select;
    req_data['sql_source'] = grid_info.sql_source;
    //req_data['sql_condition'] = grid_info.sql_condition;
    req_data['sql_condition'] = sqlcondition;
    req_data['sql_group_by'] = grid_info.sql_group_by;
    req_data['sql_having'] = grid_info.sql_having;
    req_data['sql_order_by'] = req_data['order_by']
      ? req_data['order_by']
      : grid_info.sql_order_by;
    req_data['search_columns'] = grid_info.search_columns;
    //console.log(req_data);
    //return req_data;
    const datatable_condition = await this.dropDownQueryGenerator(
      req_data,
      user_data,
    );

    const where_condition = datatable_condition['where_con'];
    let having_condition = '';
    if (grid_info.sqlhaving) {
      having_condition =
        grid_info.sqlhaving +
        '' +
        datatable_condition['having_con'].replace('HAVING', ' AND');
    } else {
      having_condition = datatable_condition['having_con'];
    }

    req_data['where_condition'] = where_condition;
    req_data['having_condition'] = having_condition;
    //console.log(req_data);
    const query = await this.sqlQueryConcat(req_data, extra_data, user_data);
    const rows = await this.knex.raw(query);
    const total_rows = rows.rows.length;

    const linkable_column = await this.dataLinkCheck(grid_info.data_link);

    const arrays = [];
    const attributes = [];

    let si = 0;
    const master_column_title = [];
    if (rows.fields) {
      for (const key of rows.fields) {
        //console.log(item);
        const flag = key['name'].split('_');
        const newTitle = key['name'].replace(
          /apsisamt_|apsisqty_|hidden_/g,
          '',
        );
        const title_name = newTitle.replace(/_/g, ' ');
        if (flag[0] == 'hidden') {
          attributes.push(key['name']);
        } else {
          const build_array = {};
          if (grid_info.master_column_title) {
            let dbtitle = true;
            try {
              dbtitle = JSON.parse(grid_info.master_column_title);
              //console.log(typeof dbtitle);
            } catch (e) {
              dbtitle = false;
            }
            if (dbtitle) {
              build_array['title'] = dbtitle[si]['title'];
              build_array['sortable'] = dbtitle[si]['sortable'];
              build_array['text_align'] = dbtitle[si]['text_align'];
              build_array['field_type'] = dbtitle[si]['field_type'];
            } else {
              build_array['title'] = title_name;
              build_array['sortable'] = true;
              build_array['text_align'] =
                flag[0] == 'apsisamt' ? 'right' : 'left';
              build_array['field_type'] =
                flag[0] == 'apsisamt' || flag[0] == 'apsisqty'
                  ? 'number'
                  : 'text';
            }
          } else {
            build_array['title'] = title.length ? title[si] : title_name;
            build_array['sortable'] = true;
            build_array['text_align'] =
              flag[0] == 'apsisamt' ? 'right' : 'left';
            build_array['field_type'] =
              flag[0] == 'apsisamt' || flag[0] == 'apsisqty'
                ? 'number'
                : 'text';
          }

          build_array['dataIndex'] = key['name'];
          build_array['key'] = key['name'];
          build_array['link'] = linkable_column.includes(key['name'])
            ? true
            : false;

          arrays.push(build_array);
          si++;
        }
      }
    }

    let grid_data: any = [];
    const grid_post = {};
    if (
      grid_info.client_side ||
      (req_data.hasOwnProperty('export') && req_data.export)
    ) {
      grid_post['slug'] = slug;
      //grid_post['pa']
      grid_data = await this.gridData(req_data, user_data);
    }

    const button_info = await this.buttonInfo(slug);
    const search_panel = await this.searchPanel(grid_info.search_panel_slug);

    const data_array = {
      master_grid_title: grid_info.master_grid_title,
      total_item: total_rows,
      select_all_btn: grid_info.select_all_btn,
      export_excel: grid_info.export_excel,
      export_pdf: grid_info.export_pdf,
      export_csv: grid_info.export_csv,
      export_printing: grid_info.export_printing,
      client_side: grid_info.client_side,
      page_customize: grid_info.page_customize,
      checkbox: grid_info.grid_checkbox,
      serial: grid_info.grid_serial,
      action_table: grid_info.action_table,
      primary_key_field: grid_info.primary_key_field,
      items: grid_data,
      attributes: attributes,
      columns: arrays,
      buttons: button_info,
      search_panel: search_panel,
    };

    return data_array;
  }

  async searchPanel(slug = '', searched_value = '', prefix = true) {
    const search_panel = await this.getSearchPanelInfo(slug);
    //console.log(search_panel);
    const data = {};
    if (search_panel) {
      data['prefix'] = prefix;
      data['session_filter'] = search_panel.default_search_by;

      const query = await this.knex('sys_search_panel_details')
        .select('*')
        .where('search_panel_slug', slug)
        .where('status', 1)
        .orderBy('sorting', 'ASC')
        .catch((error) => this.knexErrorService.errorMessage(error.message));

      data['search_fields'] = query;
      data['search_slug'] = slug;
      data['searched_value'] = searched_value;

      data['search_options'] = [];
      query.forEach(function (search_fields) {
        const searche_option_array = {
          id: search_fields.search_panel_detail_id,
          value: search_fields.label_name,
        };
        data['search_options'].push(searche_option_array);
      });

      // $sessions = session_data(array('SESSION_FILTER'));
      // $session_filter = $sessions['SESSION_FILTER'];
      // $this->data['session_filter'] = $search_panel->default_search_by;
      // if(isset($session_filter[$slug]) && !empty($session_filter[$slug])){
      //     $this->data['session_filter'] = implode(',', $session_filter[$slug]);
      // }

      return data;
    } else {
      return [];
    }
    return [];
  }

  async getSearchPanelInfo(slug) {
    const query = await this.knex('sys_search_panels')
      .select('*')
      .where('search_panel_slug', slug)
      .first()
      .catch((error) => this.knexErrorService.errorMessage(error.message));
    return query;
  }

  async getSearchPanel(slug) {
    return await this.searchPanel(slug);
  }

  async exportXlsx(req_data, user_data) {
    const data = await this.gridtitle(req_data, user_data);
    const headers = data.columns.map((col) => col.title.trim());
    const items = data.items.map((item) => {
      const regex = new RegExp('hidden_*');
      const result = {};
      Object.keys(item).map((key) => {
        if (key !== 'action' && !regex.test(key)) {
          result[key] = item[key];
        }
      });
      return result;
    });
    const payload = {
      reportName: data.master_grid_title,
      tableHeader: { headers },
      items,
    };
    return await generateXlsx(payload, user_data);
  }
  //get all table with primary key
  async getPrimaryKeyTable() {
    const result = await this.knex
      .raw(
        `
          SELECT
        tab.TABLE_NAME,
        string_agg ( kcu.COLUMN_NAME, ', ' ) AS primary_key 
      FROM
        information_schema.tables tab
        LEFT JOIN information_schema.table_constraints tco ON tco.table_schema = tab.table_schema 
        AND tco.TABLE_NAME = tab.TABLE_NAME 
        AND tco.constraint_type = 'PRIMARY KEY'
        LEFT JOIN information_schema.key_column_usage kcu ON kcu.CONSTRAINT_NAME = tco.CONSTRAINT_NAME 
        AND kcu.CONSTRAINT_SCHEMA = tco.CONSTRAINT_SCHEMA 
        AND kcu.CONSTRAINT_NAME = tco.CONSTRAINT_NAME 
      WHERE
        tab.table_schema NOT IN ( 'pg_catalog', 'information_schema' ) 
        AND tab.table_type = 'BASE TABLE' 
      GROUP BY
        tab.table_schema,
        tab.TABLE_NAME,
        tco.CONSTRAINT_NAME 
      ORDER BY
        tab.table_schema,
        tab.TABLE_NAME
    `,
      )
      .catch((error) => this.knexErrorService.errorMessage(error.message));
    const responseData = result.rows;
    console.log(responseData);
    if (responseData.length === 0 || responseData === undefined) {
      throw new HttpException('requested data not found', HttpStatus.NOT_FOUND);
    }
    return responseData;
  }
  //master grid data create
  async mastergridCreate(mastergridData: CreateMastergridDto, userPayload) {
    const payload = mastergridData;
    await this.IsSlugAvailable(payload.master_grid_slug);
    const res = await this.makeHidenColumn(
      payload.sql_select,
      payload.hide_columns,
    );
    payload.sql_select = res;
    payload.created_by = userPayload.user_id;
    payload.created_at = Helpers.mysql_date();
    payload.company_id = userPayload.company_id;
    delete payload.hide_columns;
    const result = await this.knex('sys_master_grids')
      .insert(payload, 'master_grid_id')
      .catch((error) => this.knexErrorService.errorMessage(error.message));

    if (!result) {
      throw new NotFoundException('could not created data!');
    }
    return {
      data: result,
      message: 'created new mastergrid entry',
    };
  }
  async getMastergridData(id: number, userPayload) {
    const data = await this.knex('sys_master_grids')
      .where({
        master_grid_id: id,
        status: '1',
        company_id: userPayload.company_id,
      })
      .first()
      .catch((error) => this.knexErrorService.errorMessage(error.message));
    if (data.length === 0 || data === undefined) {
      throw new HttpException('requested data not found', HttpStatus.NOT_FOUND);
    }
    const incommingSql = data.sql_select;
    const plainSQL = incommingSql.replace(/(\r\n|\n|\r)/gm, '');
    const plainSelect = plainSQL.replace('SELECT', '').trim();
    const newText = plainSelect.replace(/\t/g, '');
    const sqlArray = newText.split(',');
    const hide_columns = [];
    sqlArray.forEach((element) => {
      if (element.includes('hidden')) {
        hide_columns.push(element);
      }
    });
    data['hide_columns'] = hide_columns;
    return {
      data: data,
      message: 'successfully get mastergid data',
    };
  }
  async updateMasterGrid(id: number, mastergridData, userPayload) {
    const payload = mastergridData;
    const res = await this.makeHidenColumn(
      payload.sql_select,
      payload.hide_columns,
    );
    payload.sql_select = res;
    payload.updated_at = Helpers.mysql_date();
    payload.updated_by = userPayload.user_id;
    delete payload.hide_columns;
    const data = await this.knex('sys_master_grids')
      .update(payload)
      .where('master_grid_id', id)
      .catch((error) => this.knexErrorService.errorMessage(error.message));
    if (data.length === 0 || data === undefined) {
      throw new HttpException(
        'requested data not updated',
        HttpStatus.NOT_MODIFIED,
      );
    }
    return {
      data: data,
      message: 'mastergrid data updated',
    };
  }
  async remove(data: DeleteMasterGridDto, userpayload) {
    const userId = userpayload.user_id;
    const time = Helpers.mysql_date();
    const result = await this.knex('sys_master_grids')
      .whereIn('master_grid_id', data.ids)
      .update({
        status: '0',
        deleted_by: userId,
        deleted_at: time,
      })
      .catch((error) => this.knexErrorService.errorMessage(error.message));
    if (result === 0 || result === undefined) {
      throw new HttpException('data not updated', HttpStatus.NOT_MODIFIED);
    }
    return result;
  }
  async makeHidenColumn(sql, hiden) {
    const plainSelect = sql.replace('SELECT', '').trim();
    const selectedArray = plainSelect.split(',');
    let querryWillbeChange = false;
    selectedArray.forEach((element, index) => {
      if (hiden.includes(element)) {
        console.log(`${element} ai element hidden e ache`);
        querryWillbeChange = true;
        if (element.includes('AS')) {
          const splitArray = element.split('AS');
          const checkHidden = splitArray[1].trim();
          const hideSelect = checkHidden.includes('hidden')
            ? splitArray[0].trim() + ' AS ' + splitArray[1].trim()
            : splitArray[0].trim() + ' AS hidden_' + splitArray[1].trim();
          selectedArray[index] = hideSelect;
        } else {
          const replaceAbleSelect = element.slice(element.indexOf('.') + 1);
          const hideSelect = element + ' AS hidden_' + replaceAbleSelect;
          selectedArray[index] = hideSelect;
        }
      }
    });
    const finalSQLSelect = 'SELECT ' + selectedArray.toString();
    return querryWillbeChange ? finalSQLSelect : sql;
  }
  async IsSlugAvailable(slug) {
    const data: any = await this.knex('sys_master_grids')
      .where({
        status: '1',
      })
      .select('master_grid_slug')
      .catch((error) => this.knexErrorService.errorMessage(error.message));

    const arrayfromObj = data.map(function (obj) {
      return obj.master_grid_slug;
    });

    if (arrayfromObj.includes(slug)) {
      throw new HttpException(
        'Requested slug already exists',
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
