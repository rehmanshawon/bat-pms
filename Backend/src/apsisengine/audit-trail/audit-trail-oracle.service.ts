import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { KNEX_CONNECTION } from 'src/knexmodule';
import { Request } from 'express';
import Helpers from '../common/helpers/apsisHelper';
import { KnexErrorService } from '../common/knexerrors';
import Common_function from 'src/global/common_function.service';

@Injectable({ scope: Scope.REQUEST })
export class AuditTrailService {
  constructor(
    @Inject(KNEX_CONNECTION) private readonly knex,
    @Inject(REQUEST) private request: Request,
    private readonly knexErrorService: KnexErrorService,
    private readonly cmn_function: Common_function,
  ) {}
  //insert data in db by audit trail
  async insert(
    tableName: string,
    insertData: any,
    user_info: any = null,
    master_table_id = null,
  ) {
    //check for table name and table data for insertion
    if (!tableName || !insertData) {
      throw new NotFoundException(
        'Audit Trail-DB table/tabledata formed incorrectly',
      );
    }

    const primary_key: string = await this.primaryKeyOfTable(tableName);

    const data = await this.knex(tableName)
      .insert(insertData)
      .returning(`${primary_key}`)
      // .on('query-response', async (response: any, obj: any, builder: any) => {
      //   console.log(obj);
      //   if (response) {
      //     await this.logHistory(response, builder, user_info, master_table_id);
      //   }
      // })
      .catch((error) => this.knexErrorService.errorMessage(error.message));

    return data;
  }

  //get primary key of a table
  async primaryKeyOfTable(tableName: string): Promise<string> {
    const schema_data = await this.knex.raw(`SELECT
    cols.column_name AS "column_name"
  FROM
    all_constraints cons,
    all_cons_columns cols 
  WHERE
    cols.table_name = '${tableName}' 
    AND cons.constraint_type = 'P' 
    AND cons.constraint_name = cols.constraint_name 
    AND cons.owner = cols.owner`);
    //console.log(schema_data);
    return schema_data[0].column_name;
  }

  //update for audit trail
  async logHistory(
    response: any,
    builder: any,
    user_info: any = null,
    master_table_id = null,
  ) {
    const audit_trail_data: any = [];
    const client_ip = this.request.ip;
    //get the primary key of updated table
    const primary_key: string = await this.primaryKeyOfTable(
      builder._single.table,
    );
    //get user data from request scope or manually send user info
    const user_data: any = user_info !== null ? user_info : this.request.user;

    if (builder._method === 'insert') {
      // console.log('here insert!!!');
      const inserted_result = await this.knex(builder._single.table).whereIn(
        primary_key,
        response,
      );

      inserted_result.forEach((element) => {
        const trail_data = {
          company_id: user_data.company_id,
          table_name: builder._single.table,
          primary_key_column: primary_key,
          primary_key_id: element[primary_key],
          reference_type: builder._method,
          reference_record: JSON.stringify(builder._single.insert),
          master_table_id: master_table_id ?? '',
          log_time: this.cmn_function.cmnDatetime(),
          operation_ip: client_ip,
          created_by:
            user_info !== null ? user_info.user_id : user_data.user_id,
        };
        audit_trail_data.push(trail_data);
      });
      const audit_data = await this.knex('sys_audit_trail_historys')
        .insert(audit_trail_data)
        .catch((error) => this.knexErrorService.errorMessage(error.message));

      if (!audit_data) {
        throw new NotFoundException('audit trail log failed');
      }
      return 'success';
    }

    if (builder._method === 'update') {
      // console.log(builder);

      //get actual updated column datas
      let final_sql = '';
      const sql = builder.toString();
      let split_sql = sql.split('set ');

      const sql_form = split_sql[0].replace('update', ' FROM ');

      split_sql = split_sql[1].split('where');

      // console.log('here printing split_sql', split_sql);

      final_sql = 'SELECT * ' + sql_form + ' WHERE ' + split_sql[1];
      // console.log('here i am printing final SQL', final_sql);

      const updated_result = await this.knex.raw(final_sql);

      Object.entries(updated_result).forEach((element) => {
        const trail_data = {
          company_id: user_data.company_id,
          table_name: builder._single.table,
          primary_key_column: primary_key,
          primary_key_id: element[1][primary_key],
          reference_type: builder._method,
          reference_record: JSON.stringify(builder._single.update),
          master_table_id: master_table_id ?? '',
          log_time: this.cmn_function.cmnDatetime(),
          operation_ip: client_ip,
          created_by:
            user_info !== null ? user_info.user_id : user_data.user_id,
        };
        audit_trail_data.push(trail_data);
      });
      // console.log(audit_trail_data);
      //insert data into trail
      const audit_data = await this.knex('sys_audit_trail_historys')
        .insert(audit_trail_data)
        .catch((error) => this.knexErrorService.errorMessage(error.message));

      if (!audit_data) {
        throw new NotFoundException('audit trail log failed');
      }
      return 'success';
    }
  }
}
