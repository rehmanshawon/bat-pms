/**dependencies */
import { Inject, Injectable } from '@nestjs/common';
import { KNEX_CONNECTION } from 'src/knexmodule';
import { KnexErrorService } from 'src/apsisengine/common/knexerrors';
import { IdlogicService } from 'src/apsisengine/idlogic';
import { VoucherpostingService } from './voucherposting.service';
import Common_function from './common_function.service';

@Injectable()
export default class AutoVoucherHelper {
  constructor(
    @Inject(KNEX_CONNECTION) private readonly knex,
    private readonly knexErrorService: KnexErrorService,
    private readonly idlogic: IdlogicService,
    private readonly posting: VoucherpostingService,
    private readonly helpers: Common_function,
  ) {}

  async GenerateAutoVoucher(data) {
    const event = data.hasOwnProperty('event') ? data.event : '';
    const refid = data.hasOwnProperty('refid') ? data.refid : '';
    const userid = data.user_data.user_id;
    const amount = data.hasOwnProperty('amount') ? data.amount : '';
    const voucherno = data.hasOwnProperty('voucherno') ? data.voucherno : '';
    const voucherdate = data.hasOwnProperty('voucherdate')
      ? data.voucherdate
      : '';
    const ref = data.hasOwnProperty('ref') ? data.ref : '';
    const narration = data.hasOwnProperty('narration') ? data.narration : '';
    const product = data.hasOwnProperty('product') ? data.product : '';

    let p_vVoucherNo = '';
    if (voucherno) {
      p_vVoucherNo = voucherno;
    } else {
      const idlogicData = {
        slug: 'voucher_code',
        companyId: data.user_data.company_id,
        date: null,
        data: {
          // BR: 20,
        },
      };
      if (!data.hasOwnProperty('preview')) {
        p_vVoucherNo = await this.idlogic.generateId(idlogicData);
      }
    }
    const converted_reference_id = refid;

    const autovoucherdefination = await this.knex('acc_autovouchers')
      .select(
        'acc_autovouchers.*',
        'acc_tags.field_name',
        'acc_tags.voucher_ref_field',
        'acc_chart_of_accounts.account_name',
        'acc_tags.tag_name',
      )
      .leftJoin(
        'acc_tags',
        'acc_tags.tag_id',
        '=',
        'acc_autovouchers.primary_tag_id',
      )
      .leftJoin(
        'acc_chart_of_accounts',
        'acc_chart_of_accounts.account_code',
        '=',
        'acc_autovouchers.account_code',
      )
      .where('acc_autovouchers.product', product)
      .where('acc_autovouchers.event', event)
      .where('acc_autovouchers.company_id', data.user_data.company_id)
      .catch((error) => this.knexErrorService.errorMessage(error.message));

    const voucher_details_array = [];
    const voucher_preview_array = [];

    let sl = 0;
    let total_debit = 0;
    let total_credit = 0;

    await Promise.all(
      autovoucherdefination.map(async (avd) => {
        const adtags = await this.knex('acc_autovoucher_tags')
          .select(
            'acc_autovoucher_tags.*',
            'acc_tags.field_name',
            'acc_tags.voucher_ref_field',
            'acc_tags.tag_name',
          )
          .leftJoin(
            'acc_tags',
            'acc_tags.tag_id',
            '=',
            'acc_autovoucher_tags.tag_id',
          )
          .where('acc_autovoucher_tags.autovoucher_id', avd.autovoucher_id)
          .catch((error) => this.knexErrorService.errorMessage(error.message));

        const final_tracking_data = {};
        const final_tracking_data_preview = {};
        for (const adtag of adtags) {
          let adtag_sql = '';
          if (Number.isInteger(converted_reference_id)) {
            adtag_sql = adtag.sql.replace(/@pid/g, converted_reference_id);
          } else {
            adtag_sql = adtag.sql.replace(
              /@pid/g,
              "'" + converted_reference_id + "'",
            );
          }
          const adtag_get = await this.knex.raw(adtag_sql);
          final_tracking_data[adtag.voucher_ref_field] = adtag_get[0]?.id;
          final_tracking_data_preview[adtag.tag_name] = adtag_get[0]?.value;
        }

        const prepare_voucherdetails = {};
        const prepare_preview = {};

        let Credit = 0;
        let Debit = 0;
        if (avd.payment_caption == 'Amt') {
          const p_Amount = amount;
          if (p_Amount > 0) {
            if (avd.dr_cr == 'C') {
              total_credit += p_Amount;
              Credit = p_Amount;
            } else {
              total_debit += p_Amount;
              Debit = p_Amount;
            }
            sl++;
            // tag data
            const track_details_array = {};
            if (final_tracking_data) {
              for (const [ftkey, ftval] of Object.entries(
                final_tracking_data,
              )) {
                track_details_array[ftkey] = ftval;
              }
            }

            // for preview
            const track_details_array_preview = {};
            if (final_tracking_data_preview) {
              for (const [ftkey, ftval] of Object.entries(
                final_tracking_data_preview,
              )) {
                track_details_array_preview[ftkey] = ftval;
              }
            }
            // end tag data

            prepare_voucherdetails['voucher_line_id'] = p_vVoucherNo + '-' + sl;
            //new
            prepare_voucherdetails['company_id'] = data.user_data.company_id;
            prepare_voucherdetails['voucher_date'] = voucherdate;
            prepare_voucherdetails['voucher_type'] = 'Autovoucher';
            prepare_voucherdetails['voucher_event'] = event;
            prepare_voucherdetails['voucher_status'] = 202;
            prepare_voucherdetails['narration'] = narration;
            // prepare_voucherdetails['posted_by'] = data.user_data.user_id;
            // prepare_voucherdetails['posted_at'] = this.helpers.cmnDatetime();
            prepare_voucherdetails['voucher_tags'] =
              JSON.stringify(track_details_array);

            prepare_voucherdetails['voucher_no'] = p_vVoucherNo;
            prepare_voucherdetails['sl_no'] = sl;
            prepare_voucherdetails['branch_id'] = data.user_data.branch_id;
            prepare_voucherdetails['parent_branch_id'] =
              data.user_data.parent_branch_id;
            prepare_voucherdetails['account_code'] = avd.account_code;
            prepare_voucherdetails['debit'] = Debit;
            prepare_voucherdetails['credit'] = Credit;
            prepare_voucherdetails['remarks'] = ref;
            //prepare_voucherdetails['effective_date'] = voucherdate;
            prepare_voucherdetails['created_by'] = userid;
            prepare_voucherdetails['created_at'] = this.helpers.cmnDatetime();
            //prepare_voucherdetails['version'] = 1;
            voucher_details_array.push(prepare_voucherdetails);

            prepare_preview['account_name'] =
              avd.account_code + ' - ' + avd.account_name;
            prepare_preview['voucher_tags'] = JSON.stringify(
              track_details_array_preview,
            );
            prepare_preview['debit'] = Debit;
            prepare_preview['credit'] = Credit;
            voucher_preview_array.push(prepare_preview);
          }
        } else {
          let final_query_string = '';
          if (Number.isInteger(converted_reference_id)) {
            final_query_string = avd.payment_caption_query.replace(
              /@pid/g,
              converted_reference_id,
            );
          } else {
            final_query_string = avd.payment_caption_query.replace(
              /@pid/g,
              "'" + converted_reference_id + "'",
            );
          }
          const final_query_results = await this.knex.raw(final_query_string);
          for (const final_query_result of final_query_results) {
            const prepare_voucherdetails = {};
            const prepare_preview = {};
            let Credit = 0;
            let Debit = 0;
            if (avd.dr_cr == 'C') {
              total_credit += final_query_result.pamount;
              Credit = final_query_result.pamount;
            } else {
              total_debit += final_query_result.pamount;
              Debit = final_query_result.pamount;
            }
            sl++;

            //tag details
            const track_details_array = {};
            if (final_tracking_data) {
              track_details_array[avd.voucher_ref_field] =
                final_query_result.ptag;

              for (const [ftkey, ftval] of Object.entries(
                final_tracking_data,
              )) {
                track_details_array[ftkey] = ftval;
              }
            }

            // for preview
            const track_details_array_preview = {};
            if (final_tracking_data_preview) {
              track_details_array_preview[avd.tag_name] =
                final_query_result.ptag_value;

              for (const [ftkey, ftval] of Object.entries(
                final_tracking_data_preview,
              )) {
                track_details_array_preview[ftkey] = ftval;
              }
            }
            // tag details

            prepare_voucherdetails['voucher_line_id'] = p_vVoucherNo + '-' + sl;
            //new
            prepare_voucherdetails['company_id'] = data.user_data.company_id;
            prepare_voucherdetails['voucher_date'] = voucherdate;
            prepare_voucherdetails['voucher_type'] = 'Autovoucher';
            prepare_voucherdetails['voucher_event'] = event;
            prepare_voucherdetails['voucher_status'] = 202;
            prepare_voucherdetails['narration'] = narration;
            // prepare_voucherdetails['posted_by'] = data.user_data.user_id;
            // prepare_voucherdetails['posted_at'] = this.helpers.cmnDatetime();
            prepare_voucherdetails['voucher_tags'] =
              JSON.stringify(track_details_array);

            prepare_voucherdetails['voucher_no'] = p_vVoucherNo;
            prepare_voucherdetails['sl_no'] = sl;
            prepare_voucherdetails['branch_id'] = data.user_data.branch_id;
            prepare_voucherdetails['parent_branch_id'] =
              data.user_data.parent_branch_id;
            prepare_voucherdetails['account_code'] = avd.account_code;
            prepare_voucherdetails['debit'] = Debit;
            prepare_voucherdetails['credit'] = Credit;
            prepare_voucherdetails['remarks'] = ref;
            //prepare_voucherdetails['effective_date'] = voucherdate;
            prepare_voucherdetails['created_by'] = userid;
            prepare_voucherdetails['created_at'] = this.helpers.cmnDatetime();
            //prepare_voucherdetails['version'] = 1;
            voucher_details_array.push(prepare_voucherdetails);

            prepare_preview['account_name'] =
              avd.account_code + ' - ' + avd.account_name;
            prepare_preview['voucher_tags'] = JSON.stringify(
              track_details_array_preview,
            );
            prepare_preview['debit'] = Debit;
            prepare_preview['credit'] = Credit;
            voucher_preview_array.push(prepare_preview);
          }
        }
        //console.trace(final_tracking_data);
      }),
    );
    //console.log(~~total_debit, ~~total_credit, ~~total_debit != ~~total_credit);
    if (~~total_debit != ~~total_credit) {
      const result = {
        success: 0,
        message: 'Debit Credit Not Match',
      };
      return result;
    } else {
      if (voucher_details_array.length > 0) {
        if (data.hasOwnProperty('preview')) {
          return voucher_preview_array;
        } else {
          await this.knex('acc_vouchers')
            .insert(voucher_details_array)
            .catch((error) =>
              this.knexErrorService.errorMessage(error.message),
            );
          //await this.posting.posting(null, voucher_details_array, data.user_data);
          await this.posting.posting(p_vVoucherNo, null, data.user_data);
          const result = {
            success: 1,
            message: 'Successfully created',
          };
          // console.log('voucher');
          // console.log(p_vVoucherNo);
          return result;
        }
      } else {
        console.log('Voucher details data not found!');
      }
    }
  }
}
