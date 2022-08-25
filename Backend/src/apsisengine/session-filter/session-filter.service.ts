import { Inject, Injectable } from '@nestjs/common';
import { KNEX_CONNECTION } from 'src/knexmodule';
import { KnexErrorService } from '../common/knexerrors';

@Injectable()
export class SessionFilterService {
  constructor(
    @Inject(KNEX_CONNECTION) private readonly knex,
    private readonly knexErrorService: KnexErrorService,
  ) {}

  async setUserFilterArray(user_data) {
    const user_id = user_data.user_id;
    const user_permission = await this.knex('sys_privilege_item_users')
      .select(
        'event_ref',
        'event_slug',
        'event_slug_key',
        'permission',
        'no_permission',
        'sql_where_clause',
        this.knex.raw(
          "CONCAT(event_ref,'_',event_slug,'_',event_slug_key) as slug",
        ),
      )
      .where('reference_userid', user_id)
      .catch((error) => this.knexErrorService.errorMessage(error.message));

    // const all_permission: any = [];
    const all: any = {};
    // console.log(user_permission);
    await Promise.all(
      //for (const val of user_permission) {
      user_permission.map(async (val) => {
        const event_slug_key = {};
        // if (all_permission[val.event_ref] === undefined)
        //   all_permission[val.event_ref] = [];
        // if (all_permission[val.event_ref][val.event_slug] === undefined)
        //   all_permission[val.event_ref][val.event_slug] = [];
        // if (
        //   all_permission[val.event_ref][val.event_slug][val.event_slug_key] ===
        //   undefined
        // )
        //   all_permission[val.event_ref][val.event_slug][val.event_slug_key] =
        //     [];
        // all_permission[val.event_ref][val.event_slug][val.event_slug_key] = {
        //   permission: val.permission,
        //   no_permission: val.no_permission,
        //   sql_where_clause: val.sql_where_clause,
        // };

        event_slug_key[val.event_slug_key] = {
          permission: val.permission,
          no_permission: val.no_permission,
          sql_where_clause: val.sql_where_clause,
        };
        const key = val.event_ref + '_' + val.event_slug;
        all[key] = event_slug_key;
      }),
    );
    // console.log('----');
    // console.log(all);
    return all;
  }

  async setPermissionFilterArray(user_data) {
    //console.log(user_data);
    const user_id = user_data.user_id;
    const departments_id = user_data.department_id;
    const branchs_id = user_data.branch_id;
    const division_id = user_data.division_id;
    const user_levels_query = await this.knex('sys_privilege_roles')
      .where('user_id', user_id)
      .where('company_id', user_data.company_id)
      .catch((error) => this.knexErrorService.errorMessage(error.message));

    const user_levels_column = (arr, n) => arr.map((x) => x[n]);
    const user_levels = user_levels_column(user_levels_query, 'role_id');

    let raw =
      "SELECT event_ref, event_slug, event_slug_key, string_agg(permission:: CHARACTER VARYING, ',') as permission, string_agg(no_permission:: CHARACTER VARYING, ',') as no_permission, string_agg(sql_where_clause:: CHARACTER VARYING, ',') as sql_where_clause, CONCAT(event_ref, '_',event_slug,'_',event_slug_key) as slug FROM sys_privilege_events INNER JOIN sys_privilege_items ON sys_privilege_items.event_id=sys_privilege_events.event_id WHERE '1'";

    if (branchs_id > 0) {
      raw +=
        " AND (sys_privilege_events.event_key = 'Branch' AND '" +
        branchs_id +
        "' = ANY ( string_to_array( sys_privilege_items.reference_value, ',' )))";
      raw += " OR sys_privilege_items.reference_value = 'branch_id'";
    }

    if (user_id > 0) {
      raw +=
        " OR (sys_privilege_events.event_key = 'User' AND '" +
        user_id +
        "' = ANY ( string_to_array( sys_privilege_items.reference_value, ',' )))";

      raw += " OR sys_privilege_items.reference_value = 'user_id'";
    }

    if (departments_id > 0) {
      raw +=
        " OR (sys_privilege_events.event_key = 'Department' AND '" +
        departments_id +
        "' = ANY ( string_to_array( sys_privilege_items.reference_value, ',' )))";
      raw += " OR sys_privilege_items.reference_value = 'DEPERTMENT_ID'";
    }

    if (division_id > 0) {
      raw +=
        " OR (sys_privilege_events.event_key = 'Division' AND '" +
        division_id +
        "' = ANY ( string_to_array( sys_privilege_items.reference_value, ',')))";
      raw += " OR sys_privilege_items.reference_value = 'DIVISION_ID'";
    }

    if (user_levels.length > 0) {
      for (const level of user_levels) {
        raw +=
          " OR (sys_privilege_events.event_key = 'Level' AND '" +
          level +
          "' = ANY ( string_to_array( sys_privilege_items.reference_value, ',' )))";
        raw += " OR sys_privilege_items.reference_value = 'LEVEL_ID'";
      }
    }

    raw += ' GROUP BY slug,event_ref,event_slug,event_slug_key';
    //console.log(raw);
    const user_permission = await this.knex.raw(raw);

    const all: any = {};

    if (user_permission.rows) {
      await Promise.all(
        //for (const val of user_permission) {
        user_permission.rows.map(async (val) => {
          const event_slug_key = {};
          event_slug_key[val.event_slug_key] = {
            permission: val.permission,
            no_permission: val.no_permission,
            sql_where_clause: val.sql_where_clause,
          };
          const key = val.event_ref + '_' + val.event_slug;
          all[key] = event_slug_key;
        }),
      );
    }
    //console.log(all,'jak');

    return all;
  }
}
