import { Inject, Injectable } from '@nestjs/common';
import { KnexErrorService } from 'src/apsisengine/common/knexerrors';
import { IdlogicService } from 'src/apsisengine/idlogic';
import { KNEX_CONNECTION } from 'src/knexmodule';
import Common_function from './common_function.service';

@Injectable()
export class VoucherpostingService {
  constructor(
    @Inject(KNEX_CONNECTION) private readonly knex,
    private readonly knexErrorService: KnexErrorService,
    private readonly idlogic: IdlogicService,
    private readonly helpers: Common_function,
  ) {}
  async posting(voucher_no, voucher_details = null, user_data) {
    const tags = await this.knex('acc_tags')
      .select('voucher_ref_field')
      .where('status', 1)
      .where('is_plbs', 1)
      .catch((error) => this.knexErrorService.errorMessage(error.message));

    if (voucher_details) {
      await this.postingAction(voucher_details, tags, user_data);
    } else {
      const voucherDetails = await this.knex('acc_vouchers')
        .select('*')
        .whereIn('voucher_status', [202])
        .whereIn('voucher_no', voucher_no)
        .catch((error) => this.knexErrorService.errorMessage(error.message));

      await this.postingAction(voucherDetails, tags, user_data);
    }
  }

  async postingAction(voucher_details, tags, user_data) {
    for (const voucher of voucher_details) {
      const plbs_period = this.helpers.toFormat(
        new Date(voucher.voucher_date),
        'yy-mm',
      );
      const jobDate = new Date(voucher.voucher_date);
      const firstDay = new Date(jobDate.getFullYear(), jobDate.getMonth(), 1);
      const lastDay = new Date(
        jobDate.getFullYear(),
        jobDate.getMonth() + 1,
        0,
      );

      const plbs_group_code = await this.getPlbsGroupCode(voucher.account_code);
      const account_codes = await this.getChartOfAccountsCode(plbs_group_code);
      const voucher_tags = JSON.parse(voucher.voucher_tags);
      let voucher_tag_where = `"company_id"=
        ${user_data.company_id}
         AND "branch_id"=
        ${user_data.branch_id}
        AND "parent_branch_id"=
        ${user_data.parent_branch_id}
         AND "account_code" IN (
        ${account_codes} 
        ) AND "voucher_date" >=
        TO_DATE('${this.helpers.toFormat(
          voucher.voucher_date,
          'yy-mm-dd',
        )}', 'yyyy-mm-dd HH24:MI:SS')
        AND "voucher_date" <=
        TO_DATE('${this.helpers.toFormat(
          voucher.voucher_date,
          'yy-mm-dd',
        )}', 'yyyy-mm-dd HH24:MI:SS')`;

      const plbs_tag_where = {
        plbs_code: plbs_group_code,
        plbs_report_period: plbs_period,
        company_id: user_data.company_id,
        branch_id: user_data.branch_id,
        parent_branch_id: user_data.parent_branch_id,
      };

      const insert_plbs = {
        company_id: user_data.company_id,
        branch_id: user_data.branch_id,
        parent_branch_id: user_data.parent_branch_id,
        plbs_report_period: plbs_period,
        from_date: firstDay,
        to_date: lastDay,
        plbs_code: plbs_group_code,
      };

      tags.map((val, index) => {
        let tagval = null;
        if (
          voucher_tags &&
          typeof voucher_tags[val.voucher_ref_field] != 'undefined'
        ) {
          tagval = "'" + voucher_tags[val.voucher_ref_field] + "'";
          voucher_tag_where += ` AND json_value ( "voucher_tags", '$.
            ${val.voucher_ref_field}') = ${tagval}`;
          plbs_tag_where[val.voucher_ref_field] =
            voucher_tags[val.voucher_ref_field];
        } else {
          plbs_tag_where[val.voucher_ref_field] = tagval;
        }
        insert_plbs[val.voucher_ref_field] = voucher_tags
          ? voucher_tags[val.voucher_ref_field]
          : null;
      });

      const voucher_sql =
        'select COALESCE(SUM("debit"), 0.00) as "tdebit", COALESCE(SUM("credit"),0.00) as "tcredit" from "acc_vouchers" WHERE ' +
        voucher_tag_where;
      const voucher_result = await this.knex
        .raw(voucher_sql)
        .catch((error) => this.knexErrorService.errorMessage(error.message));

      await this.knex('acc_plbs_reports')
        .del()
        .where(plbs_tag_where)
        .catch((error) => this.knexErrorService.errorMessage(error.message));

      insert_plbs['debit'] = voucher_result[0].tdebit;
      insert_plbs['credit'] = voucher_result[0].tcredit;

      await this.knex('acc_plbs_reports')
        .insert(insert_plbs)
        .catch((error) => this.knexErrorService.errorMessage(error.message));

      const idlogicData = {
        slug: 'voucher_posting',
        companyId: user_data.company_id,
        date: null,
        data: {
          // BR: 20,
        },
      };
      const posting_code = await this.idlogic.generateId(idlogicData);

      await this.knex('acc_vouchers')
        .update({
          voucher_status: 200,
          posted_by: user_data.user_id,
          posted_at: this.helpers.cmnDatetime(),
          posting_number: posting_code,
        })
        .where('voucher_line_id', voucher.voucher_line_id)
        .catch((error) => this.knexErrorService.errorMessage(error.message));
    }
  }

  async getPlbsGroupCode(account_code) {
    const code = await this.knex('acc_chart_of_accounts')
      .select('plbs_group_code')
      .where('account_code', account_code)
      .first()
      .catch((error) => this.knexErrorService.errorMessage(error.message));
    return code.plbs_group_code;
  }

  async getChartOfAccountsCode(plbs_group_code) {
    const codes = await this.knex('acc_chart_of_accounts')
      .select('account_code')
      .where('plbs_group_code', plbs_group_code)
      .catch((error) => this.knexErrorService.errorMessage(error.message));
    let codes_string = '';
    codes.map((val) => {
      codes_string += "'" + val.account_code + "',";
    });
    const trim_string = codes_string.replace(/^|,+$/g, '');
    return trim_string;
  }
}
