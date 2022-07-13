import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Post,
  UseGuards,
  Param,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { KNEX_CONNECTION } from 'src/knexmodule';
import { JwtAuthGuard } from '../auth/guards';
import { JwtPayloadInterface } from '../auth/interfaces';
import { UserPayload } from '../utils/decorator';
import { DelegationService } from './index';
import { DelegationProcessDto } from './dto/delegation-process.dto';
import { DelegationQueryInsertDto } from './dto/delegation-query-insert.dto';

//swagger
@ApiTags('Delegation')
@ApiBearerAuth('jwt')
//apsis engine guards
@UseGuards(JwtAuthGuard)
@Controller({
  path: 'delegation',
  version: '1',
})
export class DelegationController {
  constructor(
    private readonly delegationService: DelegationService,
    @Inject(KNEX_CONNECTION) private readonly knex,
  ) {}

  // @Post('delegation-process')
  // async delegationProcess(
  //   @Body() delegationProcessDto: DelegationProcessDto,
  //   @UserPayload() user_data: JwtPayloadInterface,
  // ) {
  //   const data = delegationProcessDto;
  //   const trx = await this.knex.transaction();
  //   let result: any = [];
  //   //console.log(user_data);
  //   try {
  //     if (data.delegation_type == 'send_for_approval') {
  //       result = await this.delegationService.sendForApproval(data, user_data);
  //       console.log('result', result);
  //     } else if (data.delegation_type == 'approval') {
  //       result = await this.delegationService.delegationApprove(
  //         data,
  //         user_data,
  //       );
  //     } else if (data.delegation_type == 'decline') {
  //       result = await this.delegationService.delegationDeclineProcess(
  //         data,
  //         user_data,
  //       );
  //     } else if (data.delegation_type == 'approval_check') {
  //       result = await this.delegationService.sendForApproval(data, user_data);
  //     }
  //     await trx.commit();
  //   } catch (error) {
  //     await trx.rollback();
  //     throw new BadRequestException(error.detail);
  //   }

  //   return { messag: 'Successfull', result: result };
  // }

  @Get('modulewise-approval-count')
  async modulewiseApprovalCount(@UserPayload() user_data: JwtPayloadInterface) {
    //console.log(user_data);
    const result = await this.delegationService.modulewiseApprovalCount(
      user_data,
    );
    return { messag: 'Successfull', result: result };
  }

  @Get('/approval-module-info')
  async getApprovalModuleInfo(@Query() query: any) {
    const result = await this.delegationService.getApprovalModuleInfo(query);
    return { messag: 'Successfull', result: result };
  }

  @Get('delegation-version/:slug')
  async delegationVersion(
    @Param('slug') slug,
    @UserPayload() user_data: JwtPayloadInterface,
  ) {
    const result = await this.delegationService.getDelegationVersion(
      slug,
      user_data,
    );
    //console.log(result);
    return { message: 'Successful', result: result };
  }

  @Get('delegation-history/:ref_event/:ref_id')
  async delegationHistory(
    @Param('ref_event') ref_event,
    @Param('ref_id') ref_id,
    @UserPayload() user_data: JwtPayloadInterface,
  ) {
    const result = await this.delegationService.delegationHistory(
      ref_event,
      ref_id,
      user_data,
    );
    //console.log(result);
    return { message: 'Successful', result: result };
  }

  @Post('delegation-query-insert')
  async delegationQueryInsert(
    @Body() DelegationQueryInsertDto: DelegationQueryInsertDto,
    @UserPayload() user_data: JwtPayloadInterface,
  ) {
    const data = DelegationQueryInsertDto;
    let result: any = [];
    result = await this.delegationService.delegationQueryInsert(
      data,
      user_data,
    );
    return { messag: 'Successfull', result: result };
  }

  @Get('delegation-query-get/:ref_slug/:ref_code')
  async delegationQueryGet(
    @Param('ref_code') ref_code,
    @Param('ref_slug') ref_slug,
    @UserPayload() user_data: JwtPayloadInterface,
  ) {
    const data = {
      slug: ref_slug,
      code: ref_code,
    };
    const result = await this.delegationService.delegationQueryGet(
      data,
      user_data,
    );
    console.log(result);
    return { message: 'Successful', result: result };
  }

  // for mobile apps
  @Get('waiting-approval-list')
  async waitingApprovalList() {
    const result = await this.delegationService.waitingApprovalList();
    //console.log(result);
    return { message: 'Successful', result: result };
  }

  @UseGuards(JwtAuthGuard)
  @Post('app')
  async socketTestData(
    @Body() data: any,
    @UserPayload() jwtPayload: JwtPayloadInterface,
  ) {
    const result = await this.delegationService.testNotify(data, jwtPayload);
    // const result = await this.notificationManagerService.sendNotification(
    //   data,
    //   jwtPayload,
    // );
    return { message: 'successfull', result: result };
  }
}
