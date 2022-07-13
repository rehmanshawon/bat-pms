import { Inject, Injectable } from '@nestjs/common';
import { CommonApiDto } from './dto/common-api.dto';
import { KnexErrorService } from 'src/apsisengine/common/knexerrors';
import { IdlogicService } from 'src/apsisengine/idlogic';
import { KNEX_CONNECTION } from 'src/knexmodule';
//import { SupplyChainService } from 'src/modules/supplychain/supplychain.service';
import { AuditTrailService } from 'src/apsisengine/audit-trail/audit-trail.service';
import { encrypt, decrypt } from './helper/encryption';
@Injectable()
export class CommonApiService {
  constructor(
    @Inject(KNEX_CONNECTION) private readonly knex,
    private readonly knexErrorService: KnexErrorService,
    private readonly idlogic: IdlogicService,
   // private readonly supplyChainService: SupplyChainService,
    private readonly auditTrailService: AuditTrailService,
  ) {}

  async create(commonapiDto: CommonApiDto, userPayload) {
    const queryData = await this.knex('sys_unique_id_logics')
      .where('slug', commonapiDto.slug)
      .where('status', 1)
      .where('company_id', userPayload.company_id)
      .select(
        'draft_status',
        'after_decline_status',
        'ref_db_table_name',
        'ref_id_field',
        'ref_status_field',
      )
      .first()
      .catch((error) => this.knexErrorService.errorMessage(error.message));
    if (!queryData) {
      return 'no data found';
    }
    const statusArray = [
      queryData.draft_status,
      queryData.after_decline_status,
    ];
    const tableName = queryData.ref_db_table_name;
    const tableCodeField =
      queryData.ref_db_table_name + '.' + queryData.ref_id_field;
    const tableStatusField =
      queryData.ref_db_table_name + '.' + queryData.ref_status_field;
    const tableStatus = await this.getCodeStatus(
      commonapiDto.code,
      userPayload,
      tableCodeField,
      tableStatusField,
      tableName,
    );
    const tableStatusColumn = queryData.ref_status_field;
    const status = tableStatus[tableStatusColumn];
    const result = statusArray.includes(status) ? true : false;
    return result;
  }

  async getCodeStatus(
    code,
    userPayload,
    tableCodeField,
    tableStatusField,
    tableName,
  ) {
    const result = await this.knex(`${tableName}`)
      .where(`${tableCodeField}`, code)
      .where(`${tableName}.status`, 1)
      .where(`${tableName}.company_id`, userPayload.company_id)
      .select(`${tableStatusField}`)
      .first()
      .catch((error) => this.knexErrorService.errorMessage(error.message));
    return result;
  }
  async getEncrypt(userPayload, id) {
    const test = 'hello';
    const encryptedData = encrypt(test);
    console.log(encryptedData);
    const buff = Buffer.from(encryptedData.iv, 'utf-8');
    const decrpyted = decrypt(buff);
    console.log(decrpyted);
    return 'yes';
  }
  async getDecrypt(userPayload) {
    return 'no';
  }
}
