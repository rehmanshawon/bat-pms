import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { KNEX_CONNECTION } from 'src/knexmodule';
import { Request } from 'express';
import Helpers from '../common/helpers/apsisHelper';
import { KnexErrorService } from '../common/knexerrors';

@Injectable({ scope: Scope.REQUEST })
export class AuditTrailService {
  constructor(
    @Inject(KNEX_CONNECTION) private readonly knex,
    @Inject(REQUEST) private request: Request,
    private readonly knexErrorService: KnexErrorService,
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
      .on('query-response', async (response: any, obj: any, builder: any) => {
        if (response) {
          await this.logHistory(response, builder, user_info, master_table_id);
        }
      })
      .catch((error) => this.knexErrorService.errorMessage(error.message));

    return data;
  }

  //get primary key of a table
  async primaryKeyOfTable(tableName: string): Promise<string> {
    const schema_data = await this.knex.raw(`SELECT C
    ."column_name" 
  FROM
    information_schema.table_constraints tc
    JOIN information_schema.constraint_column_usage AS ccu USING ( CONSTRAINT_SCHEMA, CONSTRAINT_NAME )
    JOIN information_schema.COLUMNS AS C ON C.table_schema = tc.CONSTRAINT_SCHEMA 
    AND tc.TABLE_NAME = C.TABLE_NAME 
    AND ccu.COLUMN_NAME = C.COLUMN_NAME 
  WHERE
    constraint_type = 'PRIMARY KEY' 
    AND tc.TABLE_NAME = '${tableName}'`);

    return schema_data.rows[0].column_name;
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
          log_time: Helpers.mysql_datetime(),
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

      final_sql = 'SELECT * ' + sql_form + ' WHERE ' + split_sql[1];

      const updated_result = await this.knex.raw(final_sql);

      Object.entries(updated_result.rows).forEach((element) => {
        const trail_data = {
          company_id: user_data.company_id,
          table_name: builder._single.table,
          primary_key_column: primary_key,
          primary_key_id: element[1][primary_key],
          reference_type: builder._method,
          reference_record: JSON.stringify(builder._single.update),
          master_table_id: master_table_id ?? '',
          log_time: Helpers.mysql_datetime(),
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
