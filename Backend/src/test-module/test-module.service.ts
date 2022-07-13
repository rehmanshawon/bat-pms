import { Inject, Injectable } from '@nestjs/common';
import { KnexErrorService } from 'src/apsisengine/common/knexerrors';
import { KNEX_CONNECTION } from 'src/knexmodule';
import { testReqDto } from './dto/test-req.dto';
import { JwtPayloadInterface } from 'src/apsisengine/auth/interfaces';
import { AttachmentService } from 'src/apsisengine/attachment';
import { AuditTrailService } from 'src/apsisengine/audit-trail/audit-trail.service';
import { getMonthlyReport } from './reports/monthly-report';

@Injectable()
export class TestModuleService {
  constructor(
    @Inject(KNEX_CONNECTION) private readonly knex,
    private readonly knexErrorService: KnexErrorService,
    private readonly attachmentService: AttachmentService,
    private readonly auditTrailService: AuditTrailService,
  ) {}

  async testApsis() {
    try {
      return true;
    } catch (error) {
      return this.knexErrorService.errorMessage(error.message);
      // return false;
    }
  }

  async create(createuomdto: any) {
    const departmentData = {
      department_code: 'HR124',
      department_name: 'HR',
      department_short_code: 'HR',
      department_logo: 'something',
      created_by: 4,
      created_at: '2021-10-04',
      company_id: 1,
    };
    try {
      await this.knex.transaction(async (trx: any) => {
        await this.knex('sys_departments')
          .insert(departmentData)
          .transacting(trx);

        await this.knex('config_uoms').insert(createuomdto).transacting(trx);

        return true;
      });
    } catch (error) {
      return this.knexErrorService.errorMessage(error.message);
      // return false;
    }
  }
  //test file upload with attachment and form data
  async testReqCreate(data: testReqDto, user_data: JwtPayloadInterface) {
    const req_data = await this.knex('requisition').insert({
      requisition_name: data.requisition_name,
    });
    console.log((data.reference_id = req_data[0]));
    //save attachment and log data
    if (data.file) {
      data.reference_id = req_data[0];
      await this.attachmentService.saveAttatchMent(data, user_data);
    }
    return req_data;
  }

  //test audit trail update
  async updateAuditTrail(data: any, user_data: JwtPayloadInterface) {
    // const update = this.auditTrailService.update(trail_data, user_data);
    const update_data = await this.knex('requisition')
      .whereIn('req_id', data.req_id)
      .update({
        requisition_name: data.requisition_name,
        code: 'abc-12-1',
      })
      //for audit trail log
      .on('query-response', async (response: any, obj: any, builder: any) => {
        if (response) {
          await this.auditTrailService.logHistory(response, builder);
        }
      })
      .catch((error) => this.knexErrorService.errorMessage(error.message));

    return update_data;
  }
  //test audit trail insert
  async insertAuditTrail(data: any) {
    const inserted_data = {
      requisition_name: data.requisition_name,
      code: '2222',
    };
    const insert_data = await this.auditTrailService.insert(
      'requisition',
      inserted_data,
    );

    return insert_data;
  }

  async getReport(user_data: JwtPayloadInterface) {
    const payload = {
      reportName: 'Monthly Report',
      footer: 'This is Footer',
      tableHeader: { groupHeaders: {}, headers: {} },
      items: [],
    };
    payload.tableHeader.groupHeaders = {
      gl_type: [1, 3],
      ttum: [10, 12],
      product_order: [15, 16],
      bank: [19, 20],
      pay: [21, 24],
      common: [27, 33],
    };
    payload.items = await this.knex
      .select()
      .from('csa_files')
      .whereNot({ status: 0 })
      .limit(10)
      .offset(0)
      .catch((error) => this.knexErrorService.errorMessage(error.message));

    return await getMonthlyReport(payload, user_data);
  }
}
