import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { KnexErrorService } from 'src/apsisengine/common/knexerrors';
import { KNEX_CONNECTION } from 'src/knexmodule';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export default class StatusflowHelper {
  constructor(
    @Inject(KNEX_CONNECTION) private readonly knex,
    @Inject(REQUEST) private request: Request,
    private readonly knexErrorService: KnexErrorService,
  ) {}
  async status(slug: string) {
    const company_id = this.request.user['company_id'];
    //status_flows data retrieve
    const statusflowtabledata = await this.knex('sys_status_flows')
      .where('status_flow_slug', slug)
      .where('company_id', company_id)
      .where('status', '1')
      .select('status_flow_id', 'status_flows_name', 'parent_status_id')
      .catch((error: { message: string }) =>
        this.knexErrorService.errorMessage(error.message),
      );
    if (!statusflowtabledata) {
      throw new NotFoundException('No Dropdown Data found');
    }

    return statusflowtabledata;
  }
}
