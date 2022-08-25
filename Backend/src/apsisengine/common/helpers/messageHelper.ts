import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { I18nService } from 'nestjs-i18n';

@Injectable({ scope: Scope.REQUEST })
export default class MessageHelper {
  constructor(
    @Inject(REQUEST) private request: Request,
    private readonly i18n: I18nService,
  ) {}

  async lang(
    module_name: string,
    message_code: string,
    external_data: any = [],
  ) {
    //request context
    const company_id = this.request.user['company_id'];
    const slug = module_name + '.' + message_code;
    return await this.i18n.translate(slug, {
      lang: company_id,
      args: external_data,
    });
  }

  async returnMessageWithData(
    moduleName: string,
    msgIndex: string,
    msgCode: any,
    returnData: any,
  ) {
    return {
      message: await this.lang(moduleName, msgIndex, {
        code: msgCode,
      }),
      data: returnData,
    };
  }
}
