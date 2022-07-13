import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { KnexErrorService } from 'src/apsisengine/common/knexerrors';
import { KNEX_CONNECTION } from 'src/knexmodule';
import { IdLogicInterface } from './interfaces/id-logic.interface';

@Injectable()
export class IdlogicService {
  constructor(
    @Inject(KNEX_CONNECTION) private readonly knex,
    private readonly knexErrorService: KnexErrorService,
  ) {}

  async testDB() {
    const data = await this.knex('sys_users')
      .first()
      .catch((error) => this.knexErrorService.errorMessage(error.message));
    return data;
  }

  async generateId(data: IdLogicInterface) {
    const company_id = data.companyId;
    const id_logic = await this.knex('sys_unique_id_logics')
      .where('company_id', company_id)
      .where('slug', data.slug)
      .first()
      .catch((error) => this.knexErrorService.errorMessage(error.message));

    let id_format = id_logic.id_format;
    const start_id = id_logic.starting_id;
    const id_length = id_logic.id_length;

    let yyyy = 0;
    let yy = '';
    let mm = '';
    let dd = '';
    if (data.date != null) {
      const today = new Date(data.date);
      dd = String(today.getDate()).padStart(2, '0');
      mm = String(today.getMonth() + 1).padStart(2, '0');
      yyyy = today.getFullYear();
      yy = yyyy.toString().substr(-2);
    } else {
      const today = new Date();
      dd = String(today.getDate()).padStart(2, '0');
      mm = String(today.getMonth() + 1).padStart(2, '0');
      yyyy = today.getFullYear();
      yy = yyyy.toString().substr(-2);
      //pr = 'something';
    }

    const token_key = id_logic.token_reset_logic.split(',');
    let token = '';
    token_key.forEach(function (row) {
      if (data.data[row]) {
        token += data.data[row];
      } else {
        if (row === 'YYYY') {
          token += yyyy;
        } else if (row === 'YY') {
          token += yy;
        } else if (row === 'MM') {
          token += mm;
        } else if (row === 'DD') {
          token += dd;
        }
      }
    });

    const company_code = await this.knex('sys_companys')
      .select('company_code as cc')
      .where('company_id', company_id)
      .first()
      .catch((error) => this.knexErrorService.errorMessage(error.message));
    // const res = await this.knex.raw(
    //   `SELECT ${company_id} as company_id, '${
    //     company_code.cc
    //   }' as company_code, '${data.slug}' as slug ,coalesce(MAX("sequential_id"),
    //     ${start_id - 1} )+1 as squential_id , ${token} as token
    //     FROM "sys_generated_ids"
    //     WHERE "company_id"= ${company_id}
    //     and "id_token" = '${token}'
    //     and "slug"= '${data.slug}'`,
    // );
    // const payload = await this.toLowerKeys(res[0]);
    // const last_insert_data = await this.knex('sys_generated_ids')
    //   .returning('generated_id')
    //   .insert({
    //     company_id: payload.company_id,
    //     company_code: payload.company_code,
    //     slug: payload.slug,
    //     sequential_id: payload.squential_id,
    //     id_token: payload.token,
    //   });
    // const last_insert_data = await this.knex.raw(
    //   `INSERT INTO "sys_generated_ids" ( "company_id", "company_code", "slug", "sequential_id", "id_token" )
    //    SELECT ${company_id} as company_id, '${company_code.cc}', '${
    //     data.slug
    //   }' ,coalesce(MAX("sequential_id"),
    //     ${start_id - 1} )+1 , ${token}
    //     FROM "sys_generated_ids"
    //     WHERE "company_id"= ${company_id}
    //     and "id_token" = '${token}'
    //     and "slug"= '${data.slug}' returning SYS_GENERATED_ID_ID_SEQ.currval
    //     `,
    // );
    const last_insert_data = await this.knex('sys_generated_ids')
      .returning('generated_id')
      .insert({
        company_id: company_id,
        company_code: company_code.cc,
        slug: data.slug,
        sequential_id: this.knex.raw(
          `(select coalesce(MAX("sequential_id"),(${start_id} - 1))+1 from "sys_generated_ids" WHERE "company_id"=${company_id} and "id_token"='${token}' and "slug"='${data.slug}')`,
        ),
        id_token: token,
      })
      .catch((error) => this.knexErrorService.errorMessage(error.message));

    const last_insert_id = last_insert_data[0];

    const last_sequenctial_id = await this.knex('sys_generated_ids')
      .select('sequential_id as si')
      .where('generated_id', last_insert_id)
      .first()
      .catch((error) => this.knexErrorService.errorMessage(error.message));
    // console.log('si....', last_sequenctial_id);
    if (data.data.length !== 0) {
      for (const [key_name, value] of Object.entries(data.data)) {
        const index = id_format.indexOf(key_name);
        if (index !== -1) {
          id_format = id_format.replace(key_name, value);
        }
      }
    }

    const sequence_id_length = last_sequenctial_id.si.toString().length;
    const reserve_digit_number = id_length - sequence_id_length;

    let reserve = '';
    for (let i = 1; i <= reserve_digit_number; i++) {
      reserve += '0';
    }

    const actual_sequance = reserve + '' + last_sequenctial_id.si;
    id_format = id_format.replace('YYYY', yyyy);
    id_format = id_format.replace('YY', yy);
    id_format = id_format.replace('MM', mm);
    id_format = id_format.replace('DD', dd);
    id_format = id_format.replace('ID', actual_sequance);

    await this.knex('sys_generated_ids')
      .where('generated_id', last_insert_id)
      .update({
        actual_id: id_format,
      })
      .catch((error) => this.knexErrorService.errorMessage(error.message));

    return id_format;
  }
  //get id logic status code
  async getStatus(company_id: number, slug: string, status: string = null) {
    //check for slug data
    if (!slug) {
      return 'unique id logic slug not provided';
    }

    //fetch data from database
    const statusData = await this.knex('sys_unique_id_logics')
      .where('slug', slug)
      .where('status', 1)
      .where('company_id', company_id)
      .first()
      .catch((error) => this.knexErrorService.errorMessage(error.message));
    //check for empty data
    if (!statusData) {
      return 'no data found';
    }

    const statusCode = await this.switchStatusCodeData(status, statusData);

    return statusCode;
  }

  //switch
  private async switchStatusCodeData(status, statusData) {
    let statusCode = 0;
    switch (status) {
      case 'wfa':
        statusCode = statusData.initiate_approve_status;
        break;
      case 'approve':
        statusCode = statusData.after_approve_status;
        break;
      case 'decline':
        statusCode = statusData.after_decline_status;
        break;
      default:
        statusCode = statusData.draft_status;
        break;
    }

    return statusCode;
  }
  //update status check it
  async statusMatch(slug, status_code, company_id) {
    const statusData = await this.knex('sys_unique_id_logics')
      .where('slug', slug)
      .where('status', 1)
      .where('company_id', company_id)
      .first()
      .catch((error) => this.knexErrorService.errorMessage(error.message));
    if (!statusData) {
      return 'no data found';
    }
    const statusArray = [
      statusData.draft_status,
      statusData.after_decline_status,
    ];
    //console.log(statusArray);
    const result = statusArray.includes(status_code);
    if (result) {
      return result;
    } else {
      throw new HttpException(
        'good receives can not be updated',
        HttpStatus.FORBIDDEN,
      );
    }
  }
  // approvable status check
  async approveMatch(slug, status_code, company_id) {
    const statusData = await this.knex('sys_unique_id_logics')
      .where('slug', slug)
      .where('status', 1)
      .where('company_id', company_id)
      .first()
      .catch((error) => this.knexErrorService.errorMessage(error.message));
    if (!statusData) {
      return 'no data found';
    }
    const statusArray = [
      statusData.draft_status,
      statusData.after_decline_status,
    ];
    //console.log(statusArray);
    return statusArray.includes(status_code) ? true : false;
  }
  //make object lowercase
  async toLowerKeys(obj) {
    // 👇️ [ ['NAME', 'Tom'], ['AGE', 30] ]
    const entries = Object.entries(obj);

    return Object.fromEntries(
      entries.map(([key, value]) => {
        return [key.toLowerCase(), value];
      }),
    );
  }
}
