import { Inject, Injectable } from '@nestjs/common';
import { KNEX_CONNECTION } from 'src/knexmodule';
//import { AfterDelegationService } from './after-delegation.service';
import { KnexErrorService } from '../common/knexerrors';
import { DelegationProcessDto } from './dto/delegation-process.dto';
import Helpers from '../common/helpers/apsisHelper';

@Injectable()
export class DelegationService {
  constructor(
    @Inject(KNEX_CONNECTION) private readonly knex,
    private readonly knexErrorService: KnexErrorService,
    //private readonly after_delegation_service: AfterDelegationService,
  ) {}

  // async sendForApproval(data: DelegationProcessDto, user_data) {
  //   // check for DLM
  //   const id_manager_info = await this.idManagerInfo(
  //     data['slug'],
  //     user_data.company_id,
  //   );

  //   const request = [];
  //   const result = [];
  //   for (const [key, val] of Object.entries(data.code)) {
  //     const self = this;
  //     request['slug'] = data.slug;
  //     request['code'] = [val];
  //     request['from'] = 'initial';
  //     request['company_id'] = user_data.company_id;
  //     request['user_id'] = user_data.user_id;
  //     request['user_data'] = user_data;
  //     request['dtype'] = 'send_for_approval';

  //     if (id_manager_info.delegation_type == 'DLM') {
  //       const dlm_data = {
  //         code: val,
  //         slug: data.slug,
  //         delegation_version: data.delegation_version,
  //       };

  //       const dlm_conf = await this.dlmConf(
  //         dlm_data,
  //         id_manager_info,
  //         user_data,
  //       );
  //     }

  //     //Add for dynamic Delegation Version
  //     if (
  //       data.hasOwnProperty('delegation_version') &&
  //       data.delegation_version
  //     ) {
  //       request['delegation_version'] = data.delegation_version;
  //     }

  //     const result_array = await this.delegationInitialize(request);
  //     //console.log('jak');
  //     result.push(result_array);

  //     if (result_array['mode'] == 'Success') {
  //       const delegation_tracking_data = {
  //         flug: 'Processing',
  //         ref_id: val,
  //         delegation_for: data['slug'],
  //         ref_event_id: result_array['data'][val]['ref_event_id'],
  //         delegation_version: result_array['data'][val]['delegation_version'],
  //       };

  //       await this.delegationTracking(delegation_tracking_data, user_data);
  //     }
  //   }

  //   result['additional_data'] = data['additional_data'];
  //   const test_result = await this.delegationResultProcess(result);
  //   return test_result;
  // }

  // async delegationResultProcess(result_array_param) {
  //   //console.trace(result_array_param);
  //   let success_count = 0;
  //   let failed_count = 0;
  //   let failed_cause = '';
  //   const self = this;
  //   if (result_array_param) {
  //     result_array_param.forEach(async function (data) {
  //       if (Object.keys(data['data']).length > 0) {
  //         for (const [result_key, result_code] of Object.entries(data.data)) {
  //           //const job_code = result_key;
  //           //console.trace(result_key);
  //           if (result_code['mode'] == 'Success') {
  //             success_count = success_count + 1;
  //             result_code['return_status_id'] = data['status_id'];
  //             result_code['additional_data'] =
  //               result_array_param['additional_data'];
  //             result_code['user_data'] = result_array_param['user_data'];

  //             if (result_code['from'] == 'initial') {
  //               if (result_code['after_initialize_event']) {
  //                 const function_name = result_code['after_initialize_event'];
  //                 const data = await self.after_delegation_service[
  //                   function_name
  //                 ](result_key, result_code);
  //               }
  //             } else if (result_code['from'] == 'next_step') {
  //               //
  //             } else if (result_code['from'] == 'initial_decline') {
  //               //
  //             } else if (result_code['from'] == 'final_decline') {
  //               // if($result_code['after_declined_event']){
  //               //     $function_name = $result_code['after_declined_event'];
  //               //     app('App\Http\Controllers\ApsisEngine\Delegation\AfterDelegationFunctions')->$function_name($result_key,$result_code);
  //               // }
  //             } else if (result_code['from'] == 'final_approved') {
  //               // if($result_code['after_approved_event']){
  //               //     $function_name = $result_code['after_approved_event'];
  //               //     app('App\Http\Controllers\ApsisEngine\Delegation\AfterDelegationFunctions')->$function_name($result_key,$result_code);
  //               // }
  //               //console.trace(job_code);
  //               if (result_code['after_approved_event']) {
  //                 const function_name = result_code['after_approved_event'];
  //                 const data = await self.after_delegation_service[
  //                   function_name
  //                 ](result_key, result_code);
  //               }
  //             } else if (result_code['from'] == 'normal_approved') {
  //               // console.log('jak');
  //               // console.log(result_code);
  //               if (result_code['after_approved_event']) {
  //                 const function_name = result_code['after_approved_event'];
  //                 const data = await self.after_delegation_service[
  //                   function_name
  //                 ](result_key, result_code);
  //               }
  //             } else if (result_code['from'] == 'approved_fail') {
  //               //
  //             } else if (result_code['from'] == 'normal_decline') {
  //               // if($result_code['after_declined_event']){
  //               //     $function_name = $result_code['after_declined_event'];
  //               //     app('App\Http\Controllers\ApsisEngine\Delegation\AfterDelegationFunctions')->$function_name($result_key,$result_code);
  //               // }
  //             }
  //           } else {
  //             failed_count = failed_count + 1;
  //             failed_cause += result_key + ' - ' + result_code['msg'] + '<br/>';
  //           }
  //         }
  //       }
  //     });
  //   }
  //   await success_count;
  //   await failed_count;
  //   await failed_cause;
  //   const return_result =
  //     'Total Success ' +
  //     success_count +
  //     '<br/>Total Failed ' +
  //     failed_count +
  //     '<br/>' +
  //     failed_cause;
  //   //return $return_result;
  //   return return_result;
  // }

  async delegationTracking(data, user_data) {
    const insert_data = {};
    insert_data['act_status'] = data['flug'];
    if (data['flug'] == 'Processing') {
      insert_data['ref_id'] = data['ref_id'];
      insert_data['delegation_for'] = data['delegation_for'];
      insert_data['ref_event_id'] = data['ref_event_id'];
      insert_data['delegation_version'] = data['delegation_version'];
      insert_data['delegation_start'] = Helpers.mysql_datetime();
      insert_data['company_id'] = user_data.company_id;
      insert_data['created_by'] = user_data.user_id;
      insert_data['created_at'] = Helpers.mysql_datetime();
      // const insertData = async () => {
      //   await this.inserDb(insert_data);
      // };
      await this.knex('sys_delegation_tracking')
        .insert(insert_data)
        .catch((error) => {
          console.log(error);
        });
    } else {
      insert_data['delegation_end'] = Helpers.mysql_datetime();
      insert_data['updated_by'] = user_data.user_id;
      insert_data['updated_at'] = Helpers.mysql_datetime();
      // const updateData = async () => {
      //   await this.updateSDT(insert_data, data);
      // };
      await this.knex('sys_delegation_tracking')
        .where('ref_id', data['ref_id'])
        .where('delegation_for', data['delegation_for'])
        .where('ref_event_id', data['ref_event_id'])
        .where('delegation_version', data['delegation_version'])
        .update(insert_data);
    }
  }

  // async updateSDT(insert_data, data) {
  //   const kt = await this.knex('sys_delegation_tracking')
  //     .where('ref_id', data['ref_id'])
  //     .where('delegation_for', data['delegation_for'])
  //     .where('ref_event_id', data['ref_event_id'])
  //     .where('delegation_version', data['delegation_version'])
  //     .update(insert_data)
  //     .catch((error) => {
  //       console.log(error);
  //     });

  //   return kt;
  // }

  async delegationInitialize(post) {
    let step_no = null;
    if (post.hasOwnProperty('step_no')) {
      step_no = post['step_no'];
    }
    const result = {};
    // const code_data = {};
    result['mode'] = 'Success';
    const id_manager_info = await this.idManagerInfo(
      post['slug'],
      post['company_id'],
    );
    const job_info = await this.actionTableInfo(id_manager_info, post);
    //console.trace(job_info);
    //console.log(job_info);
    //Change for Dynamic Version control
    if (
      post.hasOwnProperty('delegation_version') &&
      post['delegation_version']
    ) {
      job_info['delegation_version'] = post['delegation_version'];
      id_manager_info['delegation_version'] = post['delegation_version'];
    }

    if (job_info.is_manual) {
      const step_user_info = JSON.parse(job_info.delegation_manual_user);
      step_no = step_no ? step_no : 1;
      if (step_user_info.hasOwnProperty(step_no)) {
        const releiver_of_id = await this.getReleiverOfInfo(
          step_user_info[step_no],
        );

        const delegation_conf = {
          delegation_for: id_manager_info.slug,
          ref_event_id: '',
          delegation_version: '',
          step_number: step_no,
          manage_by: '',
          same_sort: '',
        };

        await this.jobUpdateForInitialize(
          post,
          delegation_conf,
          id_manager_info,
          releiver_of_id,
          step_user_info[step_no],
        );
        result['data'][post['code'][0]]['mode'] = 'Success';
        result['data'][post['code'][0]]['msg'] = 'Successfully Initiatate.';
        result['data'][post['code'][0]]['ref_event_id'] = '';
        result['data'][post['code'][0]]['delegation_version'] = '';
        result['status_id'] = id_manager_info.initiate_approve_status;
      } else {
        result['data'][post['code'][0]]['mode'] = 'Failed';
        result['data'][post['code'][0]]['msg'] =
          'Delegation Configuration Not Found.';
        result['status_id'] = id_manager_info.initiate_approve_status;
      }
    } else {
      const delegation_conf = await this.delegationConf(
        id_manager_info,
        step_no,
        post,
      );
      //console.trace(delegation_conf);
      //Change for Dynamic Version control
      if (
        post.hasOwnProperty('delegation_version') &&
        post['delegation_version']
      ) {
        delegation_conf['delegation_version'] = post['delegation_version'];
      }
      //console.log(delegation_conf);

      if (delegation_conf) {
        switch (delegation_conf.manage_by) {
          case 'Hierarchy':
            const line_manager_info = await this.getLineManagerInfo(
              post.user_id,
            );
            if (typeof line_manager_info != 'undefined') {
              //console.log(line_manager_info);
              const releiver_of_id = await this.getReleiverOfInfo(
                line_manager_info.next_assign_person,
              );

              await this.jobUpdateForInitialize(
                post,
                delegation_conf,
                id_manager_info,
                releiver_of_id,
                line_manager_info.next_assign_person,
              );
              result['data'] = {
                [post['code'][0]]: {
                  mode: 'Success',
                  msg: 'Successfully Initiatate.',
                  ref_event_id: delegation_conf.ref_event_id,
                  delegation_version: delegation_conf.delegation_version,
                  status_id: id_manager_info.initiate_approve_status,
                },
              };
            } else {
              result['data'] = {
                [post['code'][0]]: {
                  mode: 'Failed',
                  msg: 'Line Manager Not Found.',
                  status_id: id_manager_info.initiate_approve_status,
                },
              };
            }

            break;

          case 'Designation':
            //const duser = await this.getUserInfoFromDesignationId(delegation_conf.designation_id);
            const duser = post.user_id;
            //const releiver_of_id = await this.getReleiverOfInfo($duser->id);
            const releiver_of_id = await this.getReleiverOfInfo(duser);
            await this.jobUpdateForInitialize(
              post,
              delegation_conf,
              id_manager_info,
              releiver_of_id,
              duser,
            );
            result['data'] = {
              [post['code'][0]]: {
                mode: 'Success',
                msg: 'Successfully Initiatate.',
                ref_event_id: delegation_conf.ref_event_id,
                delegation_version: delegation_conf.delegation_version,
                status_id: id_manager_info.initiate_approve_status,
              },
            };

            break;

          case 'Sorting':
            const step_info = await this.getStepInfo(
              delegation_conf,
              'sort_number',
              post.company_id,
            );

            if (delegation_conf.same_sort && step_info.length > 1) {
              await this.jobUpdateForInitialize(
                post,
                delegation_conf,
                id_manager_info,
              );
              result['data'] = {
                [post['code'][0]]: {
                  mode: 'Success',
                  msg: 'Successfully Initiatate.',
                  ref_event_id: delegation_conf.ref_event_id,
                  delegation_version: delegation_conf.delegation_version,
                  status_id: id_manager_info.initiate_approve_status,
                },
              };
            } else {
              const releiver_of_id = await this.getReleiverOfInfo(
                step_info[0].user_id,
              );
              await this.jobUpdateForInitialize(
                post,
                delegation_conf,
                id_manager_info,
                releiver_of_id,
                step_info[0].user_id,
              );
              result['data'] = {
                [post['code'][0]]: {
                  mode: 'Success',
                  msg: 'Successfully Initiatate.',
                  ref_event_id: delegation_conf.ref_event_id,
                  delegation_version: delegation_conf.delegation_version,
                  status_id: id_manager_info.initiate_approve_status,
                },
              };
            }
            break;
          case 'Limit':
            const step_infol = await this.getStepInfo(
              delegation_conf,
              'max_limit',
              post.company_id,
            );

            if (step_infol[0].max_limit) {
              const releiver_of_id = await this.getReleiverOfInfo(
                step_infol[0].user_id,
              );
              await this.jobUpdateForInitialize(
                post,
                delegation_conf,
                id_manager_info,
                releiver_of_id,
                step_infol[0].user_id,
              );

              result['data'] = {
                [post['code'][0]]: {
                  mode: 'Success',
                  msg: 'Successfully Initiatate.',
                  ref_event_id: delegation_conf.ref_event_id,
                  delegation_version: delegation_conf.delegation_version,
                  status_id: id_manager_info.initiate_approve_status,
                },
              };
            } else {
              result['data'] = {
                [post['code'][0]]: {
                  mode: 'Failed',
                  msg: 'Limit Configuration Not Found.',
                  status_id: id_manager_info.initiate_approve_status,
                },
              };
            }
            break;

          default:
            result['data'] = {
              [post['code'][0]]: {
                mode: 'Failed',
                msg: 'Something Wrong!',
                status_id: id_manager_info.initiate_approve_status,
              },
            };
            break;
        }
      } else {
        result['data'] = {
          [post['code'][0]]: {
            mode: 'Failed',
            msg: 'Delegation Configuration Not Found.',
            status_id: id_manager_info.initiate_approve_status,
          },
        };
      }
    }
    result['data'][post['code'][0]]['from'] = post['from'];
    result['data'][post['code'][0]]['after_initialize_event'] =
      id_manager_info.function_delegation_initialize;
    //console.log(result);
    return result;
  }

  async getStepInfo(delegation_configuration, order_by, company_id) {
    const result = await this.knex('sys_delegation_conf')
      .where('delegation_for', delegation_configuration.delegation_for)
      .where('delegation_version', delegation_configuration.delegation_version)
      .where('ref_event_id', delegation_configuration.ref_event_id)
      .where('step_number', delegation_configuration.step_number)
      .where('company_id', company_id)
      .orderBy(order_by, 'ASC')
      .catch((error) => {
        console.log(error);
      });
    return result;
  }

  async getLineManagerInfo(user_id) {
    const query = await this.knex('sys_users')
      .select('line_manager_id as next_assign_person')
      .where('user_id', user_id)
      .first()
      .catch((error) => this.knexErrorService.errorMessage(error.message));
    return query;
  }

  async delegationConf(id_manager_info, step_no, post) {
    const ref_event_id = await this.refEventId(id_manager_info, post);

    //console.log(ref_event_id);

    const result = await this.knex('sys_delegation_conf')
      .where((builder) => {
        builder.where('delegation_for', id_manager_info.slug);
        builder.where('ref_event_id', ref_event_id);
        builder.where('delegation_version', id_manager_info.delegation_version);
        builder.where('company_id', post['user_data'].company_id);

        if (step_no) {
          builder.where('step_number', step_no);
        }
      })
      .first()
      .catch((error) => this.knexErrorService.errorMessage(error.message));
    // console.log(result);
    // console.log(id_manager_info);
    // console.log(ref_event_id);
    // console.log(post['user_data']);
    // console.log(step_no);

    return result;
  }

  async refEventId(id_manager_info, post) {
    //console.log(id_manager_info, post);
    let ref_event_id = '';
    if (id_manager_info.delegation_trigger == 'SQL') {
      const sql = id_manager_info.trigger_sql.replace(
        '@job_code',
        "'" + post['code'][0] + "'",
      );
      const sql_raw = await this.knex.raw(sql);
      ref_event_id = sql_raw.rows[0].job_value;
    } else {
      const sessions = id_manager_info.session_variable.split(',');
      sessions.forEach(function (session) {
        ref_event_id += post['user_data'][session] + ',';
      });
    }

    const trim_string = ref_event_id.toString().replace(/^|,+$/g, '');
    return trim_string;
    //return '1,1';
  }

  async jobUpdateForInitialize(
    job_info,
    delegation_configuration,
    id_manager_info,
    reliever_of_id = null,
    assign_person_id = null,
  ) {
    const job_ids = [];
    const self = this;
    job_info['code'].forEach(async function (job) {
      job_ids.push(job);
      const delegation_reliever_id = reliever_of_id
        ? reliever_of_id
        : assign_person_id;

      const update_array = [];

      update_array['items'] = {
        delegation_for: delegation_configuration.delegation_for,
        delegation_ref_event_id: delegation_configuration.ref_event_id,
        delegation_version: delegation_configuration.delegation_version,
        delegation_step: delegation_configuration.step_number,
        delegation_person: assign_person_id,
        delegation_reliever_id: delegation_reliever_id,
        delegation_initialized: Helpers.mysql_datetime(),
      };

      if (job_info.hasOwnProperty('dtype')) {
        update_array['type'] = 'insert';
        update_array['items']['table_name'] = id_manager_info.ref_db_table_name;
        update_array['items']['table_field'] = id_manager_info.ref_id_field;
        update_array['items']['table_field_value'] = job;
        update_array['items']['created_by'] = job_info.user_data.user_id;
        update_array['items']['created_at'] = Helpers.mysql_datetime();
      } else {
        update_array['items']['updated_by'] = job_info.user_data.user_id;
        update_array['items']['updated_at'] = Helpers.mysql_datetime();
        update_array['where'] = {
          table_name: id_manager_info.ref_db_table_name,
          table_field_id: job,
        };
      }
      await self.insertDelegationColumns(update_array);

      const update_job_table = [];
      update_job_table[id_manager_info.ref_status_field] =
        id_manager_info.initiate_approve_status;

      await self
        .knex(id_manager_info.ref_db_table_name)
        .where(id_manager_info.ref_id_field, job)
        .update(update_job_table)
        .catch((error) => {
          console.log(error);
        });
    });
    //for notification
  }

  async getReleiverOfInfo(user_id) {
    const now = Helpers.mysql_datetime();
    const result = await this.knex('sys_users')
      .select('reliever_to')
      .where('user_id', user_id)
      .where('is_reliever', 1)
      .where('reliever_start_datetime', '<=', now)
      .where('reliever_end_datetime', '>=', now)
      .first()
      .catch((error) => this.knexErrorService.errorMessage(error.message));
    //console.log(result);
    if (typeof result !== 'undefined') {
      return result.reliever_to;
    } else {
      return false;
    }
  }

  //   $query_cyber->leftJoin('course_languages', function ($join) use($language) {
  //     $join->on('course_languages.course_id', '=', 'question_exam_settings.course_id')
  //         ->where('course_languages.language',$language);
  // });

  async actionTableInfo(id_logic, post) {
    const sql =
      'select * from ' +
      id_logic.ref_db_table_name +
      ' left join sys_delegation_columns on sys_delegation_columns.table_field_value=' +
      id_logic.ref_db_table_name +
      '.' +
      id_logic.ref_id_field +
      "::VARCHAR and sys_delegation_columns.table_field_value='" +
      post['code'][0] +
      "' where " +
      id_logic.ref_id_field +
      " = '" +
      post['code'][0] +
      "'";

    const sql_query = await this.knex
      .raw(sql)
      .catch((error) => this.knexErrorService.errorMessage(error.message));
    const result = sql_query.rows[0];
    //console.log(sql);
    // const result = await this.knex(id_logic.ref_db_table_name)
    //   .leftJoin('sys_delegation_columns', (builder) => {
    //     builder
    //       .on(
    //         'sys_delegation_columns.table_field_value',
    //         id_logic.ref_db_table_name + '.' + id_logic.ref_id_field,
    //       )
    //       .on(
    //         'sys_delegation_columns.table_field_value',
    //         this.knex.raw('?', post['code'][0]),
    //       );
    //   })
    //   .where(id_logic.ref_id_field, post['code'][0])
    //   .first()
    //   .catch((error) => this.knexErrorService.errorMessage(error.message));

    return result;
  }

  async idManagerInfo(slug, company_id) {
    const result = await this.knex('sys_unique_id_logics')
      .select('*')
      .where('slug', slug)
      .where('company_id', company_id)
      .first()
      .catch((error) => this.knexErrorService.errorMessage(error.message));
    return result;
  }

  // async delegationApprove(post, user_data) {
  //   const result = [];
  //   const request = [];
  //   const self = this;
  //   for (const [key, val] of Object.entries(post['code'])) {
  //     request['slug'] = post['slug'];
  //     request['code'] = val;
  //     request['comments'] = post['comments'];
  //     request['additional_data'] = post['additional_data'];

  //     if (
  //       post.hasOwnProperty('delegation_version') &&
  //       post['delegation_version']
  //     ) {
  //       request['delegation_version'] = post['delegation_version'];
  //     }

  //     const result_array = await self.delegationApprovalProcess(
  //       request,
  //       user_data,
  //     );

  //     result.push(result_array);
  //     //console.log('jakir');
  //   }
  //   result['additional_data'] = post['additional_data'];
  //   result['comments'] = post['comments'];
  //   result['user_data'] = user_data;
  //   console.log('one');
  //   console.log(result);
  //   const test_result = await this.delegationResultProcess(result);
  //   return test_result;
  // }

  async delegationApprovalProcess(post, user_data) {
    const id_logic = await this.idManagerInfo(
      post['slug'],
      user_data.company_id,
    );

    const actionTablePostData = {
      code: [post['code']],
      user_data: user_data,
    };
    const job_info = await this.actionTableInfo(id_logic, actionTablePostData);

    if (
      post.hasOwnProperty('delegation_version') &&
      post['delegation_version'].length > 0
    ) {
      job_info['delegation_version'] = post['delegation_version'];
      id_logic['delegation_version'] = post['delegation_version'];
    }
    let result = {};
    if (job_info['is_manual']) {
      const current_step = job_info['delegation_step'];
      const next_step = current_step + 1;
      const step_user_info = JSON.parse(
        JSON.stringify(job_info['delegation_manual_user']),
      );
      const next_conf_array = {
        step_number: step_user_info.hasOwnProperty(next_step) ? next_step : '',
        ref_event_id: null,
        delegation_version: null,
      };

      const result = await this.nextStepOrFinalApproveAction(
        id_logic,
        next_conf_array,
        post,
        job_info,
        user_data,
      );
      await this.insertDelegationHistory(job_info, 'Approved', post, user_data);
    } else {
      const conf = await this.configurationInfoSingleRow(job_info, user_data);

      result['mode'] = 'Success';
      switch (conf.manage_by) {
        case 'Hierarchy':
          //console.log('jak000');
          const session_variable = conf.session_variable.replace(
            '@delegation_person_id',
            job_info.delegation_person,
          );
          //console.log(session_variable);
          const termination_value = await this.knex.raw(session_variable);
          //  console.log('jak');
          //  console.log(termination_value[0]);
          let termination_value_array = [];
          if (termination_value.rows) {
            const termination_value_json = termination_value.rows;
            const arrayColumn = (arr, n) => arr.map((x) => x[n]);
            termination_value_array = arrayColumn(
              termination_value_json,
              'termination_values',
            );
          }
          if (
            termination_value_array.includes(Number(conf.termination_trigger))
          ) {
            result = await this.nextStepOrFinalApprove(
              post,
              id_logic,
              job_info,
              user_data,
            );
            // console.log('jak');
            // console.log(result);
            //insert delegation history
            await this.insertDelegationHistory(
              job_info,
              'Approved',
              post,
              user_data,
            );
            // console.log('jak1');
            //     console.log(result);
          } else {
            const orginal_user_info = await this.knex('sys_users')
              .where('user_id', job_info['delegation_person'])
              .first()
              .catch((error) =>
                this.knexErrorService.errorMessage(error.message),
              );
            if (orginal_user_info.line_manager_id) {
              const releiver_of_id = await this.getReleiverOfInfo(
                orginal_user_info.line_manager_id,
              );

              const update_job_table = {};
              update_job_table['items']['delegation_person'] =
                orginal_user_info.line_manager_id;
              update_job_table['items']['delegation_reliever_id'] =
                releiver_of_id
                  ? releiver_of_id
                  : orginal_user_info.line_manager_id;
              update_job_table['items']['updated_by'] = user_data.user_id;
              update_job_table['items']['updated_at'] =
                Helpers.mysql_datetime();
              update_job_table['where']['table_name'] =
                id_logic['ref_db_table_name'];
              update_job_table['where']['table_field_id'] = post['code'];
              update_job_table['type'] = null;

              //update job table
              await this.insertDelegationColumns(update_job_table);
              // await this.knex(id_logic['ref_db_table_name'])
              //   .where(id_logic['ref_id_field'], post['code'])
              //   .update(update_job_table);

              //insert delegation history
              await this.insertDelegationHistory(
                job_info,
                'Approved',
                post,
                user_data,
              );
              result['data'] = {
                [post['code'][0]]: {
                  mode: 'Success',
                  msg: 'Successfully Updated.',
                  from: 'normal_approved',
                  status_id: id_logic['initiate_approve_status'],
                  after_approved_event: id_logic['ref_event_id'],
                },
              };
            } else {
              result['data'] = {
                [post['code'][0]]: {
                  mode: 'Failed',
                  msg: 'Line Manager Not Found.',
                  from: 'approved_fail',
                  status_id: id_logic['initiate_approve_status'],
                },
              };
            }
          }
          break;
        case 'Designation':
          result = await this.nextStepOrFinalApprove(
            post,
            id_logic,
            job_info,
            user_data,
          );
          //insert delegation history
          await this.insertDelegationHistory(
            job_info,
            'Approved',
            post,
            user_data,
          );

          break;
        case 'Sorting':
          if (conf.same_sort) {
            const must_approve_object = await this.configurationInfoMultiRow(
              job_info,
              user_data,
            );

            const arrayColumn = (arr, n) => arr.map((x) => x[n]);
            const must_approve_array = arrayColumn(
              must_approve_object,
              'user_id',
            );

            //insert delegation history
            await this.insertDelegationHistory(
              job_info,
              'Approved',
              post,
              user_data,
            );

            //find next step or final approve
            const total_approve = await this.totalDelegationHistory(
              job_info,
              post,
              'Approved',
              user_data,
            );
            // console.log('jak');
            // console.log(conf.approve_priority);
            const must_approve_person = await this.totalDelegationHistory(
              job_info,
              post,
              'Approved',
              user_data,
              must_approve_array,
            );

            const total_person_of_same_sort = await this.totalPersonOfSameSort(
              job_info,
              user_data,
            );

            if (conf.approve_priority == 'All') {
              if (total_person_of_same_sort == total_approve) {
                result = await this.nextStepOrFinalApprove(
                  post,
                  id_logic,
                  job_info,
                  user_data,
                );
              } else {
                result['data'] = {
                  [post['code'][0]]: {
                    mode: 'Success',
                    msg: 'Successfully Updated.',
                    from: 'normal_approved',
                    status_id: id_logic['initiate_approve_status'],
                    after_approved_event:
                      id_logic['function_delegation_approved'],
                  },
                };
              }
            } else if (conf.approve_priority == 'Majority') {
              // console.log('jak');
              // console.log(must_approve_array.length);
              // console.log(total_approve);
              // console.log(total_person_of_same_sort / 2);
              // console.log(must_approve_person);
              if (
                must_approve_array.length == 0 &&
                total_approve > total_person_of_same_sort / 2
              ) {
                result = await this.nextStepOrFinalApprove(
                  post,
                  id_logic,
                  job_info,
                  user_data,
                );
              } else if (
                must_approve_array.length > 0 &&
                must_approve_array.length == must_approve_person &&
                total_approve > total_person_of_same_sort / 2
              ) {
                result = await this.nextStepOrFinalApprove(
                  post,
                  id_logic,
                  job_info,
                  user_data,
                );
                // console.log('jak2');
                // console.log(result);
              } else {
                result['data'] = {
                  [post['code'][0]]: {
                    mode: 'Success',
                    msg: 'Successfully Updated.',
                    from: 'normal_approved',
                    status_id: id_logic['initiate_approve_status'],
                    after_approved_event:
                      id_logic['function_delegation_approved'],
                  },
                };
              }
            } else if (conf.approve_priority == 'Minority') {
              if (
                must_approve_array.length > 0 &&
                must_approve_array.length == must_approve_person
              ) {
                result = await this.nextStepOrFinalApprove(
                  post,
                  id_logic,
                  job_info,
                  user_data,
                );
              } else if (must_approve_array.length < 1 && total_approve > 0) {
                result = await this.nextStepOrFinalApprove(
                  post,
                  id_logic,
                  job_info,
                  user_data,
                );
              } else {
                result['data'] = {
                  [post['code'][0]]: {
                    mode: 'Success',
                    msg: 'Successfully Updated.',
                    from: 'normal_approved',
                    status_id: id_logic['initiate_approve_status'],
                    after_approved_event:
                      id_logic['function_delegation_approved'],
                  },
                };
              }
            }
          } else {
            const step_sort = await this.configurationInfoSingleRow(
              job_info,
              user_data,
              'for_user_info',
            );

            const next_person = await this.knex('sys_delegation_conf')
              .where('delegation_for', job_info['delegation_for'])
              .where('ref_event_id', job_info['delegation_ref_event_id'])
              .where('delegation_version', job_info['delegation_version'])
              .where('step_number', job_info['delegation_step'])
              .where('sort_number', '>', step_sort.sort_number)
              .where('company_id', user_data.company_id)
              .orderBy('sort_number', 'ASC')
              .first()
              .catch((error) =>
                this.knexErrorService.errorMessage(error.message),
              );

            if (next_person) {
              //console.log('jak00');
              const releiver_of_id = await this.getReleiverOfInfo(
                next_person.user_id,
              );
              //console.log('jak01');
              const update_job_table = {};
              update_job_table['items'] = {
                delegation_person: next_person.user_id,
              };

              update_job_table['items']['delegation_reliever_id'] =
                releiver_of_id ? releiver_of_id : next_person.user_id;
              update_job_table['items']['updated_by'] = user_data.user_id;
              update_job_table['items']['updated_at'] =
                Helpers.mysql_datetime();

              update_job_table['where'] = {
                table_name: id_logic['ref_db_table_name'],
              };
              update_job_table['where']['table_field_id'] = post['code'];
              update_job_table['type'] = null;

              //update job table
              await this.insertDelegationColumns(update_job_table);
              // await this.knex(id_logic['ref_db_table_name'])
              //   .where(id_logic['ref_id_field'], post['code'])
              //   .update(update_job_table);

              result['data'] = {
                [post['code'][0]]: {
                  mode: 'Success',
                  msg: 'Successfully Updated.',
                  from: 'normal_approved',
                  status_id: id_logic['initiate_approve_status'],
                  after_approved_event:
                    id_logic['function_delegation_approved'],
                },
              };
            } else {
              result = await this.nextStepOrFinalApprove(
                post,
                id_logic,
                job_info,
                user_data,
              );
            }
            //insert delegation history
            await this.insertDelegationHistory(
              job_info,
              'Approved',
              post,
              user_data,
            );
          }
          break;
        case 'Limit':
          const job_amount_query_string = id_logic['sql_calc_amount'].replace(
            '@generated_id',
            '"' + post['code'] + '"',
          );

          const job_amount_query = await this.knex.raw(job_amount_query_string);

          const delegation_conf_user_info =
            await this.configurationInfoSingleRow(
              job_info,
              user_data,
              'for_user_info',
            );

          if (
            delegation_conf_user_info.max_limit >=
            job_amount_query.rows[0].amount
          ) {
            result = await this.nextStepOrFinalApprove(
              post,
              id_logic,
              job_info,
              user_data,
            );
          } else {
            const next_limit_person = await this.knex('sys_delegation_conf')
              .where('delegation_for', job_info['delegation_for'])
              .where('ref_event_id', job_info['delegation_ref_event_id'])
              .where('delegation_version', job_info['delegation_version'])
              .where('step_number', job_info['delegation_step'])
              .where('max_limit', '>', delegation_conf_user_info.max_limit)
              .where('company_id', user_data.company_id)
              .first()
              .catch((error) =>
                this.knexErrorService.errorMessage(error.message),
              );

            if (next_limit_person) {
              const releiver_of_id = await this.getReleiverOfInfo(
                next_limit_person.user_id,
              );
              const update_job_table = {};
              update_job_table['items'] = {
                delegation_person: next_limit_person.user_id,
              };
              update_job_table['items']['delegation_reliever_id'] =
                releiver_of_id ? releiver_of_id : next_limit_person.user_id;
              update_job_table['items']['updated_by'] = user_data.user_id;
              update_job_table['items']['updated_at'] =
                Helpers.mysql_datetime();
              update_job_table['where'] = {
                table_name: id_logic['ref_db_table_name'],
              };
              update_job_table['where']['table_field_id'] = post['code'];
              update_job_table['type'] = null;

              //update job table
              await this.insertDelegationColumns(update_job_table);
              // await this.knex(id_logic['ref_db_table_name'])
              //   .where(id_logic['ref_id_field'], post['code'])
              //   .update(update_job_table);

              result['data'] = {
                [post['code'][0]]: {
                  mode: 'Success',
                  msg: 'Successfully Updated.',
                  from: 'normal_approved',
                  status_id: id_logic['initiate_approve_status'],
                  after_approved_event:
                    id_logic['function_delegation_approved'],
                },
              };
            } else {
              result = await this.nextStepOrFinalApprove(
                post,
                id_logic,
                job_info,
                user_data,
              );
            }
          }
          await this.insertDelegationHistory(
            job_info,
            'Approved',
            post,
            user_data,
          );
          break;

        default:
          result['data'] = {
            [post['code'][0]]: {
              mode: 'Failed',
              msg: 'Something wrong.',
              from: 'fail',
              status_id: id_logic['initiate_approve_status'],
            },
          };

          break;
      }
    }

    return result;
  }

  async totalPersonOfSameSort(job_info, user_data) {
    const result = await this.knex('sys_delegation_conf')
      .count('delegation_conf_id as total')
      .where('delegation_for', job_info.delegation_for)
      .where('ref_event_id', job_info.delegation_ref_event_id)
      .where('delegation_version', job_info.delegation_version)
      .where('step_number', job_info.delegation_step)
      .where('same_sort', 1)
      .where('company_id', user_data.company_id)
      .first();
    return result.total;
  }

  async totalDelegationHistory(
    job_info,
    post,
    action_type,
    user_data,
    must_approve = [],
  ) {
    const total_approve = await this.knex('sys_delegation_historys')
      .count('ref_event as total')
      .where((builder) => {
        builder.where('ref_event', job_info.delegation_for);
        builder.where('ref_id', post['code']);
        builder.where('step_no', job_info.delegation_step);
        builder.where('act_status', action_type);
        builder.where(
          'delegation_decline_count',
          job_info.delegation_decline_count,
        );
        builder.where('company_id', user_data.company_id);

        if (must_approve.length > 0) {
          builder.whereIn('delegation_person', must_approve);
        }
      })
      .first()
      .catch((error) => {
        console.log(error);
      });

    return total_approve ? total_approve.total : 0;
  }

  async configurationInfoMultiRow(job_info, user_data) {
    return await this.knex('sys_delegation_conf')
      .select('user_id')
      .where('delegation_for', job_info.delegation_for)
      .where('ref_event_id', job_info.delegation_ref_event_id)
      .where('delegation_version', job_info.delegation_version)
      .where('step_number', job_info.delegation_step)
      .where('same_sort', 1)
      .where('must_approve', 1)
      .where('company_id', user_data.company_id);
  }

  async nextStepOrFinalApprove(post, id_logic, job_info, user_data) {
    const next_conf = await this.knex('sys_delegation_conf')
      .where('delegation_for', job_info.delegation_for)
      .where('ref_event_id', job_info.delegation_ref_event_id)
      .where('delegation_version', job_info.delegation_version)
      .where('step_number', '>', job_info.delegation_step)
      .where('company_id', user_data.company_id)
      .orderBy('step_number', 'ASC')
      .first()
      .catch((error) => {
        console.log(error);
      });

    let nextConf = [];
    if (typeof next_conf !== 'undefined') {
      nextConf = next_conf;
    }
    const result = await this.nextStepOrFinalApproveAction(
      id_logic,
      nextConf,
      post,
      job_info,
      user_data,
    );
    return result;
  }

  async configurationInfoSingleRow(job_info, user_data, query_type = '') {
    const result = await this.knex('sys_delegation_conf')
      .where((builder) => {
        builder.where('delegation_for', job_info.delegation_for);
        builder.where('ref_event_id', job_info.delegation_ref_event_id);
        builder.where('delegation_version', job_info.delegation_version);
        builder.where('step_number', job_info.delegation_step);
        builder.where('company_id', user_data.company_id);

        if (query_type == 'for_user_info') {
          builder.where('user_id', job_info.delegation_person);
        }
      })
      .first()
      .catch((error) => this.knexErrorService.errorMessage(error.message));
    return result;
  }

  async insertDelegationHistory(job_info, action_type, post, user_data) {
    const delegation_history = {
      ref_event: post['slug'],
      company_id: user_data.company_id,
      ref_id: post['code'],
      step_no: job_info.delegation_step,
      act_status: action_type,
      delegation_person: job_info.delegation_person
        ? job_info.delegation_person
        : user_data.user_id,
      delegation_reliever_id: job_info.delegation_reliever_id
        ? job_info.delegation_reliever_id
        : user_data.user_id,
      act_comments: post['comments'],
      additional_data: post['additional_data'], // additional_data
      delegation_decline_count: job_info.delegation_decline_count,
      created_by: user_data.user_id,
      created_at: Helpers.mysql_datetime(),
    };
    // console.log('jak');
    // console.log(delegation_history);
    const insert_data = await this.knex('sys_delegation_historys')
      .insert(delegation_history)
      .catch((error) => this.knexErrorService.errorMessage(error.message));
    console.log(insert_data);
  }

  async nextStepOrFinalApproveAction(
    id_logic,
    next_conf,
    post,
    job_info,
    user_data,
  ) {
    const sdt_ref_event_id = job_info['delegation_ref_event_id'];
    const sdt_delegation_version = job_info['delegation_version'];
    const request = [];
    let result = {};

    if (next_conf.hasOwnProperty('step_number') && next_conf['step_number']) {
      //initiate next step
      request['slug'] = post['slug'];
      request['step_no'] = next_conf['step_number'];
      request['code'] = [post['code']];
      request['from'] = 'next_step';
      request['delegation_version'] = next_conf['delegation_version'];
      request['company_id'] = user_data.company_id;
      request['user_data'] = user_data;
      //Add for dynamic Delegation Version
      if (
        post.hasOwnProperty('delegation_version') &&
        post['delegation_version']
      ) {
        request['delegation_version'] = post['delegation_version'];
      }

      result = await this.delegationInitialize(request);
    } else {
      // final approve

      const update_data = {};
      update_data['items'] = {
        delegation_for: null,
      };

      update_data['items']['delegation_ref_event_id'] = null;

      update_data['items']['delegation_version'] = null;
      update_data['items']['delegation_step'] = null;
      update_data['items']['delegation_person'] = null;
      update_data['items']['delegation_reliever_id'] = null;

      update_data['items']['delegation_final_approved'] =
        Helpers.mysql_datetime();
      update_data['items']['updated_by'] = user_data.user_id;
      update_data['items']['updated_at'] = Helpers.mysql_datetime();
      update_data['where'] = {
        table_name: id_logic['ref_db_table_name'],
      };
      update_data['where']['table_field_id'] = post['code'];
      update_data['type'] = null;

      await this.insertDelegationColumns(update_data);

      const update_job_data = [];
      update_job_data[id_logic.ref_status_field] =
        id_logic.after_approve_status;

      await this.knex(id_logic.ref_db_table_name)
        .where(id_logic.ref_id_field, post['code'])
        .update(update_job_data);

      result['data'] = {
        [post['code']]: {
          mode: 'Success',
          msg: 'Successfully Approved.',
          from: 'final_approved',
          after_approved_event: id_logic.function_delegation_approved,
        },
      };
      result['status_id'] = id_logic.after_approve_status;
      await this.delegationTracking(
        {
          flug: 'Approved',
          ref_id: post['code'],
          delegation_for: post['slug'],
          ref_event_id: sdt_ref_event_id,
          delegation_version: sdt_delegation_version,
        },
        user_data,
      );
    }
    return result;
  }

  async insertDelegationColumns(data) {
    if (data['type'] == 'insert') {
      const ext_val = await this.knex('sys_delegation_columns')
        .where('table_name', data['items']['table_name'])
        .where('table_field_value', data['items']['table_field_value'])
        .first()
        .catch((error) => this.knexErrorService.errorMessage(error.message));

      if (ext_val) {
        await this.knex('sys_delegation_columns')
          .where('table_name', data['items']['table_name'])
          .where('table_field_value', data['items']['table_field_value'])
          .update(data['items'])
          .catch((error) => this.knexErrorService.errorMessage(error.message));
      } else {
        await this.knex('sys_delegation_columns')
          .insert(data['items'])
          .catch((error) => this.knexErrorService.errorMessage(error.message));
      }
    } else {
      await this.knex('sys_delegation_columns')
        .where('table_name', data['where']['table_name'])
        .where('table_field_value', data['where']['table_field_id'])
        .update(data['items'])
        .catch((error) => this.knexErrorService.errorMessage(error.message));
    }
  }

  // async delegationDeclineProcess(post, user_data) {
  //   const request = [];
  //   const result = [];

  //   const self = this;
  //   for (const [key, val] of Object.entries(post.code)) {
  //     request['slug'] = post['slug'];
  //     request['code'] = val;
  //     request['comments'] = post['comments'];
  //     request['additional_data'] = post['additional_data'];

  //     if (
  //       post.hasOwnProperty('delegation_version') &&
  //       post.delegation_version
  //     ) {
  //       request['delegation_version'] = post['delegation_version'];
  //     }
  //     const result_array = await self.delegationStart(request, user_data);
  //     //console.trace(result_array);
  //     console.log(result_array);
  //     result.push(result_array);
  //   }

  //   result['additional_data'] = post['additional_data'];
  //   result['comments'] = post['comments'];
  //   const test_result = await this.delegationResultProcess(result);
  //   return test_result;
  // }

  async delegationStart(post, user_data) {
    const id_logic = await this.idManagerInfo(
      post['slug'],
      user_data.company_id,
    );
    console.log(id_logic);
    const actionTablePost = {
      code: [post['code']],
      user_data: user_data,
    };
    const job_info = await this.actionTableInfo(id_logic, actionTablePost);
    let result = {};
    result['mode'] = 'Success';

    await this.insertDelegationHistory(job_info, 'Declined', post, user_data);

    if (job_info.is_manual) {
      await this.knex(id_logic.ref_db_table_name)
        .where(id_logic.ref_id_field, post['code'])
        .update({
          delegation_for: null,
          delegation_ref_event_id: null,
          delegation_version: null,
          delegation_step: null,
          delegation_person: null,
          delegation_reliever_id: null,
          [id_logic.ref_status_field]: id_logic.after_decline_status,
          delegation_decline_count: this.knex.raw('delegation_decline_count+1'),
          delegation_manual_user: null,
          is_manual: 0,
        });

      result['data'] = {
        [post['code'][0]]: {
          mode: 'Success',
          msg: 'Successfully Declined.',
          from: 'final_decline',
          after_declined_event: id_logic.function_delegation_declined,
        },
      };
      result['status_id'] = id_logic.after_decline_status;

      await this.delegationTracking(
        {
          flug: 'Daclined',
          ref_id: post['code'],
          delegation_for: post['slug'],
          ref_event_id: null,
          delegation_version: null,
        },
        user_data,
      );
    } else {
      const conf = await this.configurationInfoSingleRow(job_info, user_data);
      if (conf.same_sort) {
        if (conf.approve_priority == 'All') {
          result = await this.prevStepInitiateAfterDecline(
            job_info,
            id_logic,
            post,
            user_data,
          );
        } else if (conf.approve_priority == 'Majority') {
          const total_decline_person = await this.totalDeclinePerson(
            job_info,
            post,
            user_data,
          );
          const total_step_person = await this.totalPersonOfSameSort(
            job_info,
            user_data,
          );
          if (total_decline_person >= total_step_person / 2) {
            result = await this.prevStepInitiateAfterDecline(
              job_info,
              id_logic,
              post,
              user_data,
            );
          }
        } else if (conf.approve_priority == 'Minority') {
          const total_decline_person = await this.totalDeclinePerson(
            job_info,
            post,
            user_data,
          );
          const total_step_person = await this.totalPersonOfSameSort(
            job_info,
            user_data,
          );
          if (total_decline_person == total_step_person) {
            result = await this.prevStepInitiateAfterDecline(
              job_info,
              id_logic,
              post,
              user_data,
            );
          }
        }
      } else {
        let user_config: any = {};
        if (conf.manage_by == 'Hierarchy') {
          user_config = conf;
        } else {
          user_config = await this.configurationInfoSingleRow(
            job_info,
            user_data,
            'for_user_info',
          );
        }

        if (user_config.decline_logic == 'Initiator') {
          await this.knex('sys_delegation_columns')
            .where('table_name', id_logic.ref_db_table_name)
            .where('table_field_value', post['code'])
            .update({
              delegation_for: null,
              delegation_ref_event_id: null,
              delegation_version: null,
              delegation_step: null,
              delegation_person: null,
              delegation_reliever_id: null,
              delegation_decline_count: this.knex.raw(
                'delegation_decline_count+1',
              ),
            })
            .catch((error) =>
              this.knexErrorService.errorMessage(error.message),
            );

          await this.knex(id_logic.ref_db_table_name)
            .where(id_logic.ref_id_field, post['code'])
            .update({
              [id_logic.ref_status_field]: id_logic.after_decline_status,
            })
            .catch((error) =>
              this.knexErrorService.errorMessage(error.message),
            );

          result['data'] = {
            [post['code'][0]]: {
              mode: 'Success',
              msg: 'Successfully Declined.',
              from: 'final_decline',
              after_declined_event: id_logic.function_delegation_declined,
            },
          };

          result['status_id'] = id_logic.after_decline_status;

          await this.delegationTracking(
            {
              flug: 'Declined',
              ref_id: post['code'],
              delegation_for: post['slug'],
              ref_event_id: conf.ref_event_id,
              delegation_version: conf.delegation_version,
            },
            user_data,
          );
        } else {
          const last_approval_person = await this.lastApprovalPersonInfo(
            job_info,
            post,
            user_data,
          );
          if (last_approval_person) {
            const releiver_of_id = await this.getReleiverOfInfo(
              last_approval_person.delegation_person,
            );
            await this.knex('sys_delegation_columns')
              .where('table_field_value', post['code'])
              .where('table_name', id_logic.ref_db_table_name)
              .update({
                delegation_person: last_approval_person.delegation_person,
                delegation_reliever_id: releiver_of_id
                  ? releiver_of_id
                  : last_approval_person.delegation_person,
                delegation_decline_count: this.knex.raw(
                  'delegation_decline_count+1',
                ),
              });

            result['data'] = {
              [post['code'][0]]: {
                mode: 'Success',
                msg: 'Successfully Declined.',
                from: 'normal_decline',
                after_declined_event: id_logic.function_delegation_declined,
              },
            };
            result['status_id'] = id_logic.initiate_approve_status;
          } else {
            result = await this.prevStepInitiateAfterDecline(
              job_info,
              id_logic,
              post,
              user_data,
            );
          }
        }
      }
    }
    return result;
  }

  async prevStepInitiateAfterDecline(job_info, id_logic, post, user_data) {
    const result = {};
    result['mode'] = 'Success';
    const sdt_delegation_version = job_info.delegation_version;
    const sdt_delegation_ref_event_id = job_info.delegation_ref_event_id;
    const prev_conf = await this.knex('sys_delegation_conf')
      .where('delegation_for', job_info.delegation_for)
      .where('ref_event_id', job_info.delegation_ref_event_id)
      .where('delegation_version', job_info.delegation_version)
      .where('step_number', '<', job_info.delegation_step)
      .where('company_id', user_data.company_id)
      .orderBy('step_number', 'DESC')
      .first()
      .catch((error) => this.knexErrorService.errorMessage(error.message));

    if (prev_conf) {
      if (prev_conf.same_sort) {
        //self::insertDelegationHistory($job_info,'Declined',$post);
        await this.knex('sys_delegation_columns')
          .where('table_field_value', post['code'])
          .where('table_name', id_logic.ref_db_table_name)
          .update({
            delegation_for: null,
            delegation_ref_event_id: null,
            delegation_version: null,
            delegation_step: null,
            delegation_person: null,
            delegation_reliever_id: null,
            delegation_decline_count: this.knex.raw(
              'delegation_decline_count+1',
            ),
          });

        await this.knex(id_logic.ref_db_table_name)
          .where(id_logic.ref_id_field, post['code'])
          .update({
            [id_logic.ref_status_field]: id_logic.after_decline_status,
          })
          .catch((error) => this.knexErrorService.errorMessage(error.message));

        result['data'] = {
          [post['code'][0]]: {
            mode: 'Success',
            msg: 'Successfully Declined.',
            from: 'normal_decline',
            after_declined_event: id_logic.function_delegation_declined,
          },
        };
      } else {
        const result_array = await this.knex('sys_delegation_historys')
          .select('delegation_person')
          .where('ref_event', job_info.delegation_for)
          .where('ref_id', post['code'])
          .where('step_no', prev_conf.step_number)
          .where('act_status', 'Approved')
          .where('company_id', user_data.company_id)
          .orderBy('created_at', 'DESC')
          .first();

        const releiver_of_id = await this.getReleiverOfInfo(
          result_array.delegation_person,
        );
        await this.knex('sys_delegation_columns')
          .where('table_field_value', post['code'])
          .where('table_name', id_logic.ref_db_table_name)
          .update({
            delegation_step: prev_conf.step_number,
            delegation_person: result_array.delegation_person,
            delegation_reliever_id: releiver_of_id
              ? releiver_of_id
              : result_array.delegation_person,
            delegation_decline_count: this.knex.raw(
              'delegation_decline_count+1',
            ),
          });

        result['data'] = {
          [post['code'][0]]: {
            mode: 'Success',
            msg: 'Successfully Declined.',
            from: 'normal_decline',
            after_declined_event: id_logic.function_delegation_declined,
          },
        };
        result['status_id'] = id_logic.initiate_approve_status;
      }
    } else {
      await this.knex('sys_delegation_columns')
        .where('table_field_value', post['code'])
        .where('table_name', id_logic.ref_db_table_name)
        .update({
          delegation_for: null,
          delegation_ref_event_id: null,
          delegation_version: null,
          delegation_step: null,
          delegation_person: null,
          delegation_reliever_id: null,
          delegation_decline_count: this.knex.raw('delegation_decline_count+1'),
        });

      await this.knex(id_logic.ref_db_table_name)
        .where(id_logic.ref_id_field, post['code'])
        .update({
          [id_logic.ref_status_field]: id_logic.after_decline_status,
        })
        .catch((error) => this.knexErrorService.errorMessage(error.message));

      result['data'] = {
        [post['code'][0]]: {
          mode: 'Success',
          msg: 'Successfully Declined.',
          from: 'final_decline',
          after_declined_event: id_logic.function_delegation_declined,
        },
      };

      result['status_id'] = id_logic.after_decline_status;

      await this.delegationTracking(
        {
          flug: 'Declined',
          ref_id: post['code'],
          delegation_for: post['slug'],
          ref_event_id: sdt_delegation_ref_event_id,
          delegation_version: sdt_delegation_version,
        },
        user_data,
      );
    }
    return result;
  }

  async totalDeclinePerson(job_info, post, user_data) {
    const result = await this.knex('sys_delegation_historys')
      .count('ref_event as total')
      .where('ref_event', job_info.delegation_for)
      .where('ref_id', post['code'])
      .where('step_no', job_info.delegation_step)
      .where('act_status', 'Declined')
      .where('delegation_decline_count', job_info.delegation_decline_count)
      .where('company_id', user_data.company_id)
      .groupBy('ref_event')
      .first();
    return result ? result.total : 0;
  }

  async lastApprovalPersonInfo(job_info, post, user_data) {
    const result = await this.knex('sys_delegation_historys')
      .select('delegation_person')
      .where('ref_event', job_info.delegation_for)
      .where('ref_id', post['code'])
      .where('step_no', job_info.delegation_step)
      .where('act_status', 'Approved')
      .where('delegation_decline_count', job_info.delegation_decline_count)
      .orderBy('created_at', 'DESC')
      .first();
    return result;
  }

  async dlmConf(data, id_manager_info, user_data) {
    const job_amount_query_string = id_manager_info['sql_calc_amount'].replace(
      '@generated_id',
      "'" + data['code'] + "'",
    );

    const job_amount_query = await this.knex.raw(job_amount_query_string);

    const job_amount = job_amount_query.rows[0].amount;

    const refeventpost = {
      code: [data['code']],
      user_data: user_data,
    };
    const ref_event_id = await this.refEventId(id_manager_info, refeventpost);

    const dms = await this.knex('sys_delegation_matrix')
      .where('delegation_slug', data['slug'])
      .where('company_id', user_data.company_id)
      .where('ref_event_id', ref_event_id)
      .orderBy('order_no', 'ASC')
      .catch((error) => this.knexErrorService.errorMessage(error.message));

    const post_data = {
      user_data: user_data,
      code: [data['code']],
    };
    const self = this;
    for (const [key, val] of Object.entries(dms)) {
      //console.log('jak1');
      if (job_amount <= val['max_limit'] && val['limit_type'] == 'Maximum') {
        //console.log('jak2');
        const dlml = await self.dlmMatrixLogic(val, post_data, data);
        break;
      } else if (
        job_amount >= val['max_limit'] &&
        val['limit_type'] == 'Above'
      ) {
        //console.log('jak3');
        const dlml = await self.dlmMatrixLogic(val, post_data, data);
        break;
      }
    }
  }

  async dlmMatrixLogic(val, post_data, data) {
    // const id_manager_info = await this.idManagerInfo(
    //   data['slug'],
    //   post_data['user_data']['company_id'],
    // );
    //const ref_event_id = await this.refEventId(id_manager_info, post_data);

    // const ac = {
    //   code: post_data['code'][0],
    // };
    //const job_info = await this.actionTableInfo(id_manager_info, ac);

    const logics_sql = await this.knex('sys_delegation_matrix_logic')
      .where('dlm_steps', val['dlm_steps'])
      .where('company_id', post_data['user_data']['company_id'])
      .first()
      .catch((error) => this.knexErrorService.errorMessage(error.message));

    const logic_sql = logics_sql.logic_sql.replace(
      '@user_id',
      post_data['user_data']['user_id'],
    );
    // console.log('jak5');
    // console.log(logic_sql);
    const logics = await this.knex.raw(logic_sql);
    //console.log('jak00');
    //console.log(logics[0]);

    const self = this;
    for (const logic of logics.rows) {
      //console.log(logic);
      const insertData = {
        company_id: post_data['user_data']['company_id'],
        delegation_for: data['slug'],
        ref_event_id: val['ref_event_id'],
        delegation_version: data['delegation_version'],
        manage_by: 'Sorting',
        user_id: logic.job_value,
        max_limit: null,
        limit_type: 'Maximum',
        sort_number: null,
        same_sort: 1,
        step_number: 1,
        must_approve: 0,
        approve_priority: 'All',
        step_name: 'One',
        decline_logic: 'Initiator',
        designation_id: null,
        termination_trigger: null,
        session_variable: null,
        created_by: post_data['user_data']['user_id'],
        created_at: Helpers.mysql_datetime(),
        status: 1,
      };

      await self
        .knex('sys_delegation_conf')
        .insert(insertData)
        .catch((error) => this.knexErrorService.errorMessage(error.message));
    }
  }

  async modulewiseApprovalCount(user_data) {
    const approval_modules_names = await this.knex('sys_approval_modules')
      .where('status', 1)
      .catch((error) => this.knexErrorService.errorMessage(error.message));

    //console.log(approval_modules_names);

    let counted = 0;
    const self = this;
    const payload = [];
    await Promise.all(
      approval_modules_names.map(async (item) => {
        if (item.custom_query) {
          const custom_query_with_reliever = item.custom_query.replace(
            '@USER_ID',
            user_data.user_id,
          );
          const custom_query = custom_query_with_reliever.replace(
            '@RELIEVER_ID',
            user_data.user_id,
          );
          const total = await self.knex.raw(custom_query);
          counted = total.rows.length;
        } else {
          const slug = item.unique_id_logic_slug;
          const app_count = await self.waitingForApproval(slug, user_data);
          counted = app_count.length;
        }

        if (counted) {
          const return_array = {
            color_class: item.color_class,
            approval_url: item.approval_url,
            unique_id_logic_slug: item.unique_id_logic_slug,
            sys_master_grid_name: item.master_grid_name,
            icon_class: item.icon_class,
            sys_approval_modules_name: item.approval_module_name,
            modal_url: item.details_in_modal_url,
            body_url: item.details_in_body_url,
            total: counted,
          };
          payload.push(return_array);
        }
      }),
    );
    return payload;
  }

  async waitingForApproval(slug, user_data) {
    //console.trace(slug);
    const id_logic = await this.idManagerInfo(slug, user_data.company_id);
    const sql =
      'SELECT ' +
      id_logic.ref_db_table_name +
      '.' +
      id_logic.ref_id_field +
      ' FROM ' +
      id_logic.ref_db_table_name +
      ' LEFT JOIN sys_delegation_columns ON sys_delegation_columns.table_field_value=' +
      id_logic.ref_db_table_name +
      '.' +
      id_logic.ref_id_field +
      '::VARCHAR WHERE ' +
      id_logic.ref_db_table_name +
      '.' +
      id_logic.ref_status_field +
      ' = ' +
      id_logic.initiate_approve_status +
      ' AND sys_delegation_columns.delegation_reliever_id =' +
      user_data.user_id +
      ' GROUP BY ' +
      id_logic.ref_db_table_name +
      '.' +
      id_logic.ref_id_field +
      ' UNION ALL SELECT ' +
      id_logic.ref_db_table_name +
      '.' +
      id_logic.ref_id_field +
      ' FROM ' +
      id_logic.ref_db_table_name +
      ' LEFT JOIN sys_delegation_columns ON sys_delegation_columns.table_field_value=' +
      id_logic.ref_db_table_name +
      '.' +
      id_logic.ref_id_field +
      '::VARCHAR LEFT JOIN sys_delegation_conf ON sys_delegation_columns.delegation_for=sys_delegation_conf.delegation_for AND sys_delegation_columns.delegation_ref_event_id=sys_delegation_conf.ref_event_id AND sys_delegation_columns.delegation_version=sys_delegation_conf.delegation_version AND sys_delegation_columns.delegation_step=sys_delegation_conf.step_number AND sys_delegation_conf.same_sort=1 AND sys_delegation_conf.user_id=' +
      user_data.user_id +
      ' WHERE ' +
      id_logic.ref_db_table_name +
      '.' +
      id_logic.ref_id_field +
      '::VARCHAR NOT IN(select ref_id from sys_delegation_historys where sys_delegation_historys.ref_id=' +
      id_logic.ref_db_table_name +
      '.' +
      id_logic.ref_id_field +
      "::VARCHAR AND sys_delegation_historys.step_no=sys_delegation_columns.delegation_step AND sys_delegation_historys.delegation_decline_count=sys_delegation_columns.delegation_decline_count AND sys_delegation_historys.ref_event='" +
      id_logic.slug +
      "' AND sys_delegation_historys.delegation_reliever_id=" +
      user_data.user_id +
      ') AND sys_delegation_conf.user_id=' +
      user_data.user_id +
      ' AND ' +
      id_logic.ref_db_table_name +
      '.' +
      id_logic.ref_status_field +
      '=' +
      id_logic.initiate_approve_status +
      ' AND sys_delegation_columns.delegation_step IS NOT NULL AND sys_delegation_columns.delegation_reliever_id IS NULL GROUP BY ' +
      id_logic.ref_db_table_name +
      '.' +
      id_logic.ref_id_field;
    console.log(sql);
    const results_raw = await this.knex
      .raw(sql)
      .catch((error) => this.knexErrorService.errorMessage(error.message));
    return results_raw.rows;

    // const results = await this.knex(id_logic.ref_db_table_name)
    //   .select(id_logic.ref_db_table_name + '.' + id_logic.ref_id_field)
    //   .leftJoin(
    //     'sys_delegation_columns',
    //     'sys_delegation_columns.table_field_value',
    //     '=',
    //     id_logic.ref_db_table_name + '.' + id_logic.ref_id_field,
    //   )
    //   .where(
    //     id_logic.ref_db_table_name + '.' + id_logic.ref_status_field,
    //     id_logic.initiate_approve_status,
    //   )
    //   .where('sys_delegation_columns.delegation_reliever_id', user_data.user_id)
    //   .groupBy(id_logic.ref_db_table_name + '.' + id_logic.ref_id_field)
    //   .unionAll(function () {
    //     this.from(id_logic.ref_db_table_name)
    //       .select(id_logic.ref_db_table_name + '.' + id_logic.ref_id_field)
    //       .leftJoin(
    //         'sys_delegation_columns',
    //         'sys_delegation_columns.table_field_value',
    //         '=',
    //         id_logic.ref_db_table_name + '.' + id_logic.ref_id_field,
    //       )
    //       .leftJoin('sys_delegation_conf', function () {
    //         this.on(
    //           'sys_delegation_columns.delegation_for',
    //           '=',
    //           'sys_delegation_conf.delegation_for',
    //         )
    //           .andOn(
    //             'sys_delegation_columns.delegation_ref_event_id',
    //             'sys_delegation_conf.ref_event_id',
    //           )
    //           .andOn(
    //             'sys_delegation_columns.delegation_version',
    //             'sys_delegation_conf.delegation_version',
    //           )
    //           .andOn(
    //             'sys_delegation_columns.delegation_step',
    //             'sys_delegation_conf.step_number',
    //           )
    //           .andOn('sys_delegation_conf.same_sort', 1)
    //           .andOn('sys_delegation_conf.user_id', user_data.user_id);
    //       })
    //       .whereRaw(
    //         id_logic.ref_db_table_name +
    //           '.' +
    //           id_logic.ref_id_field +
    //           ' NOT IN(select ref_id from sys_delegation_historys where sys_delegation_historys.ref_id=' +
    //           id_logic.ref_db_table_name +
    //           '.' +
    //           id_logic.ref_id_field +
    //           " AND sys_delegation_historys.step_no=sys_delegation_columns.delegation_step AND sys_delegation_historys.delegation_decline_count=sys_delegation_columns.delegation_decline_count AND sys_delegation_historys.ref_event='" +
    //           id_logic.slug +
    //           "' AND sys_delegation_historys.delegation_reliever_id=" +
    //           user_data.user_id +
    //           ')',
    //       )
    //       .where('sys_delegation_conf.user_id', user_data.user_id)
    //       .where(
    //         id_logic.ref_db_table_name + '.' + id_logic.ref_status_field,
    //         id_logic.initiate_approve_status,
    //       )
    //       .whereNotNull('sys_delegation_columns.delegation_step')
    //       .whereNull('sys_delegation_columns.delegation_reliever_id');
    //   })
    //   .catch((error) => this.knexErrorService.errorMessage(error.message));
    // return results;
  }

  async getDelegationVersion(slug, UserPayload) {
    const result = await this.knex('sys_unique_id_logics')
      .where('slug', slug)
      .select('delegation_version')
      .first()
      .catch((error) => this.knexErrorService.errorMessage(error.message));
    return result;
  }

  async getApprovalModuleInfo(query: any) {
    const data = await this.knex('sys_approval_modules')
      .where({
        ...query,
        status: 1,
      })
      .catch((error) => this.knexErrorService.errorMessage(error.message));

    return data;
  }

  async delegationHistory(ref_event, ref_id, user_data) {
    const result = await this.knex('sys_delegation_historys')
      .select('sys_delegation_historys.*', 'sys_users.full_name')
      .leftJoin(
        'sys_users',
        'sys_users.user_id',
        '=',
        'sys_delegation_historys.delegation_reliever_id',
      )
      .where('ref_event', ref_event)
      .where('ref_id', ref_id)
      .catch((error) => this.knexErrorService.errorMessage(error.message));
    return result;
  }
}
