import { Inject, Injectable } from '@nestjs/common';
import { KNEX_CONNECTION } from 'src/knexmodule';
import Helpers from '../common/helpers/apsisHelper';
import { KnexErrorService } from '../common/knexerrors';
import { delegationSubmission } from './dto/delegation_Submission.dto';

@Injectable()
export class DelegationConfService {
  constructor(
    @Inject(KNEX_CONNECTION) private readonly knex,
    private readonly knexErrorService: KnexErrorService,
  ) {}

  async delegationConfSet(slug, user_data) {
    const result = await this.knex('sys_unique_id_logics')
      .select('delegation_type', 'slug', 'id_for', 'ref_event_slug')
      .where('slug', slug)
      .where('company_id', user_data.company_id)
      .first()
      .catch((error) => this.knexErrorService.errorMessage(error.message));
    const ref_event_slug = result.ref_event_slug.split(',');
    const da = {
      delegation_type: result.delegation_type,
      slug: result.slug,
      id_for: result.id_for,
      ref_event_slug: ref_event_slug,
    };
    return da;
  }

  async getDlms() {
    const result = await this.knex('sys_delegation_matrix_logic')
      .select('delegation_matrix_logic_id', 'dlm_steps', 'order_no')
      .catch((error) => this.knexErrorService.errorMessage(error.message));
    return result;
  }

  // async getDelegationView(slug, user_data) {
  //   const self = this;
  //   const id_logic = await this.knex('sys_unique_id_logics')
  //     .where('slug', slug)
  //     .where('company_id', user_data.company_id)
  //     .first()
  //     .catch((error) => this.knexErrorService.errorMessage(error.message));
  //   const dlm_data = {};
  //   if (id_logic.delegation_type == 'DLM') {
  //     const dlm_matrix = await this.knex('sys_delegation_matrix')
  //       .where('delegation_slug', slug)
  //       .where('company_id', user_data.company_id)
  //       .orderBy('order_no', 'ASC')
  //       .catch((error) => this.knexErrorService.errorMessage(error.message));

  //     const event_result = await self.getRefEvent(dlm_matrix[0], id_logic);

  //     dlm_matrix.forEach(async function (dlm, i) {
  //       if (dlm_data[dlm.ref_event_id] === undefined)
  //         dlm_data[dlm.ref_event_id] = [];

  //       const payload = {
  //         ref_event: event_result,
  //         dlm_step: dlm.dlm_steps,
  //         limit: dlm.max_limit,
  //         limit_type: dlm.limit_type,
  //       };
  //       // console.log(event_result);
  //       dlm_data[dlm.ref_event_id].push(payload);
  //     });
  //   } else if (id_logic.delegation_type == 'MC') {
  //     // const confs = await this.knex('sys_delegation_conf')
  //     //   .where('delegation_for', slug)
  //     //   .where('company_id', user_data.company_id)
  //     //   .catch((error) => this.knexErrorService.errorMessage(error.message));
  //     // // console.log('jak00');
  //     // // console.log(confs);
  //     // const mc_obj = [];
  //     // confs.forEach(async function (conf, i) {
  //     //   mc_obj['ref_event'] = conf.ref_event_id;
  //     //   mc_obj['user'] = 1;
  //     //   dlm_data['data'].push(mc_obj);
  //     // });
  //   }
  //   const result_array = {
  //     id_for: id_logic.id_for,
  //     delegation_type: id_logic.delegation_type,
  //     item: dlm_data,
  //   };
  //   return await result_array;
  // }

  async getDelegationView(slug, user_data) {
    const self = this;
    const id_logic = await this.knex('sys_unique_id_logics')
      .where('slug', slug)
      .where('company_id', user_data.company_id)
      .first()
      .catch((error) => this.knexErrorService.errorMessage(error.message));
    const dlm_data = [];
    if (id_logic.delegation_type == 'DLM') {
      const dlm_matrix = await this.knex('sys_delegation_matrix')
        .where('delegation_slug', slug)
        .where('company_id', user_data.company_id)
        .groupBy('ref_event_id')
        .catch((error) => this.knexErrorService.errorMessage(error.message));

      console.log(dlm_matrix);

      for (const dlm of dlm_matrix) {
        const event_result = await self.getRefEvent(dlm, id_logic);
        dlm_data.push({
          slug: id_logic.slug,
          id_for: id_logic.id_for,
          delegation_type: id_logic.delegation_type,
          ref_event_name: id_logic.ref_event_slug,
          ref_event_id: dlm.ref_event_id,
          ref_event_value: event_result,
        });
      }
    } else {
      const confs = await this.knex('sys_delegation_conf')
        .where('delegation_for', slug)
        .where('company_id', user_data.company_id)
        .catch((error) => this.knexErrorService.errorMessage(error.message));

      for (const conf of confs) {
        const event_result = await self.getRefEvent(conf, id_logic);
        dlm_data.push({
          slug: id_logic.slug,
          id_for: id_logic.id_for,
          delegation_type: id_logic.delegation_type,
          ref_event_name: id_logic.ref_event_slug,
          ref_event_id: conf.ref_event_id,
          ref_event_value: event_result,
        });
      }
    }
    return await dlm_data;
  }

  async getRefEvent(dlm, id_logic) {
    const event_val = dlm.ref_event_id.split(',');
    const event_name = id_logic.ref_event_slug.split(',');
    const self = this;
    let event_result = '';

    await Promise.all(
      event_name.map(async (name, i) => {
        const dropdown = await self
          .knex('sys_dropdowns')
          .where('dropdown_slug', name)
          .first()
          .catch((error) => self.knexErrorService.errorMessage(error.message));
        const ref_val_name = await self.knex.raw(
          dropdown.sql_select +
            ' ' +
            dropdown.sql_source +
            ' WHERE ' +
            dropdown.value_field +
            ' = ' +
            event_val[i],
        );
        event_result += `${dropdown.option_field}: ${
          ref_val_name[0][0][dropdown.option_field]
        }, `;
      }),
    );
    return event_result.replace(/,\s*$/, '');
  }

  async delegationDetails(post, user_data) {
    const dlm_data = [];
    const wf_data = {};
    if (post.delegation_type == 'DLM') {
      const dlm_matrix = await this.knex('sys_delegation_matrix')
        .where('delegation_slug', post.slug)
        .where('company_id', user_data.company_id)
        .orderBy('order_no', 'ASC')
        .catch((error) => this.knexErrorService.errorMessage(error.message));

      for (const dlm of dlm_matrix) {
        dlm_data.push({
          dlm_step: dlm.dlm_steps,
          limit: dlm.max_limit,
          limit_type: dlm.limit_type,
        });
      }
      return dlm_data;
    } else if (post.delegation_type == 'MC') {
      const confs = await this.knex('sys_delegation_conf')
        .leftJoin(
          'sys_users',
          'sys_users.user_id',
          '=',
          'sys_delegation_conf.user_id',
        )
        .select(
          'sys_users.full_name',
          'sys_delegation_conf.manage_by',
          'sys_delegation_conf.step_number',
        )
        .where('sys_delegation_conf.delegation_for', post.slug)
        .where('sys_delegation_conf.ref_event_id', post.ref_event_id)
        .where('sys_delegation_conf.company_id', user_data.company_id)
        .catch((error) => this.knexErrorService.errorMessage(error.message));

      for (const conf of confs) {
        dlm_data.push({
          user: conf.full_name,
          manage_by: conf.manage_by,
          step_no: conf.step_number,
        });
      }
      return dlm_data;
    } else {
      const confs = await this.knex('sys_delegation_conf')
        .leftJoin(
          'sys_users',
          'sys_users.user_id',
          '=',
          'sys_delegation_conf.user_id',
        )
        .select('sys_users.full_name', 'sys_delegation_conf.*')
        .where('sys_delegation_conf.delegation_for', post.slug)
        .where('sys_delegation_conf.ref_event_id', post.ref_event_id)
        .where('sys_delegation_conf.company_id', user_data.company_id)
        .catch((error) => this.knexErrorService.errorMessage(error.message));

      for (const conf of confs) {
        if (wf_data[conf.step_number] === undefined)
          wf_data[conf.step_number] = [];

        const payload = {
          manage_by: conf.manage_by,
          user: conf.full_name,
          max_limit: conf.max_limit,
          limit_type: conf.limit_type,
          sort: conf.sort_number,
          same_sort: conf.same_sort,
          must_approve: conf.must_approve,
          approve_priority: conf.approve_priority,
          decline_logic: conf.decline_logic,
        };
        wf_data[conf.step_number].push(payload);
      }
      return wf_data;
    }
  }

  async delegationSubmission(post: delegationSubmission, user_data: any) {
    const ref_event_id = Object.keys(post.ref_event)
      .map(function (k) {
        return post.ref_event[k];
      })
      .join(',');
    if (post.approve_type === 'DLM') {
      const exist = await this.knex('sys_delegation_matrix')
        .where('delegation_slug', post.delegation_for)
        .where('ref_event_id', ref_event_id)
        .first()
        .catch((error) => this.knexErrorService.errorMessage(error.message));
      if (exist) {
        return { message: 'Data Already Exist!!!' };
      } else {
        const payload = post.DLM.map((item) => {
          return {
            ...item,
            company_id: user_data.company_id,
            ref_event_id,
            delegation_slug: post.delegation_for,
          };
        });
        await this.knex('sys_delegation_matrix')
          .insert(payload)
          .catch((error) => this.knexErrorService.errorMessage(error.message));
      }
    } else if (post.approve_type === 'Maker Checker') {
      const exist = await this.knex('sys_delegation_conf')
        .where('delegation_for', post.delegation_for)
        .where('ref_event_id', ref_event_id)
        .first()
        .catch((error) => this.knexErrorService.errorMessage(error.message));
      if (exist) {
        return { message: 'Data Already Exist!!!' };
      } else {
        if (post.maker_checker.type === 'Line Manager') {
          const obj = await this.knex('sys_users')
            .select('line_manager_id')
            .where('user_id', user_data.user_id)
            .first()
            .catch((error) =>
              this.knexErrorService.errorMessage(error.message),
            );
          post.maker_checker.user_id = obj.line_manager_id;
        } else {
          post.maker_checker.user_id = post.maker_checker.user_id;
        }
        const payload = {
          user_id: post.maker_checker.user_id,
          delegation_version: 1,
          company_id: user_data.company_id,
          delegation_for: post.delegation_for,
          manage_by: 'Sorting',
          ref_event_id,
          max_limit: null,
          limit_type: 'Maximum',
          sort_number: null,
          same_sort: 1,
          step_number: 1,
          must_approve: 0,
          approve_priority: 'All',
          step_name: 'One',
          decline_logic: 'Initiator',
          created_by: user_data.user_id,
          created_at: Helpers.mysql_datetime(),
        };
        //console.log(payload);
        await this.knex('sys_delegation_conf')
          .insert(payload)
          .catch((error) => this.knexErrorService.errorMessage(error.message));
      }
    } else if (post.approve_type === 'Process Flow') {
      const exist = await this.knex('sys_delegation_conf')
        .where('delegation_for', post.delegation_for)
        .where('ref_event_id', ref_event_id)
        .first()
        .catch((error) => this.knexErrorService.errorMessage(error.message));
      if (exist) {
        return { message: 'Data Already Exist!!!' };
      } else {
        const payload = [];
        post.process_flow.map((item) => {
          item.users.map((element) => {
            const delegationConfData = {
              company_id: user_data.company_id,
              delegation_for: post.delegation_for,
              delegation_version: 1,
              ref_event_id,
              approve_priority: item.approve_priority,
              manage_by: item.manage_by,
              same_sort: item.same_sort,
              step_name: item.step_name,
              step_number: item.step_number,
              user_id: element.value,
              max_limit: element.max_limit,
              decline_logic: element.decline_logic,
              must_approve: element.must_approve,
              created_by: user_data.user_id,
              created_at: Helpers.mysql_datetime(),
            };
            payload.push(delegationConfData);
          });
        });
        //console.log(delegationConf);
        await this.knex('sys_delegation_conf')
          .insert(payload)
          .catch((error) => this.knexErrorService.errorMessage(error.message));
      }
    }
  }
}
