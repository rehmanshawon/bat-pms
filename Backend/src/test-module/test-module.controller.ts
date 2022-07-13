/**dependencies */
import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IdlogicService } from 'src/apsisengine/idlogic';
import Helpers from 'src/apsisengine/common/helpers/apsisHelper';
import { CompanyId } from 'src/apsisengine/utils/decorator/company-id.decorator';
import { JwtAuthGuard } from 'src/apsisengine/auth/guards';
import { ApiFiles, AuthId, UserPayload } from 'src/apsisengine/utils/decorator';
import { TestModuleService } from './test-module.service';
import { testReqDto } from './dto/test-req.dto';
import { JwtPayloadInterface } from 'src/apsisengine/auth/interfaces';
import { SessionFilterService } from 'src/apsisengine/session-filter';
import AutoVoucher from 'src/global/autovoucher.service';
import Common_function from 'src/global/common_function.service';

//swagger docs
@ApiTags('Test Module')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
@Controller({
  //route name
  path: 'test-controller',
  //api version
  version: '1',
})
export class TestModuleController {
  constructor(
    private readonly idlogic: IdlogicService,
    private readonly testService: TestModuleService,
    private readonly sessionFilter: SessionFilterService,
    private readonly autovoucher: AutoVoucher,
    private readonly cmn: Common_function,
  ) {}

  //route name
  @Get('test-db')
  async testdb() {
    const money = Helpers.money_format(1000, 'USD');
    const date = Helpers.mysql_date();
    const datetime = Helpers.mysql_datetime();
    console.log(money);
    console.log(date);
    console.log(datetime);
    const data = await this.idlogic.testDB();
    return { message: 'success', result: data };
  }

  @Get('id-logic')
  async getIdLogic(@CompanyId() company_id: number) {
    console.log(company_id);
    const idlogicData = {
      slug: 'test_dev',
      companyId: company_id,
      date: '2025-05-02',
      data: {
        CAT: 'ADS',
      },
    };
    const data = await this.idlogic.generateId(idlogicData);
    return { message: 'success', result: data };
  }

  @Post()
  async create(
    @Body() createuomdto: any,
    @AuthId() userId: number,
    @CompanyId() companyId: number,
  ) {
    const payload = createuomdto;
    payload.created_by = userId;
    payload.created_at = Helpers.mysql_date();
    payload.company_id = companyId;
    const data = await this.testService.create(payload);
    return { message: 'successfull', result: data };
  }
  @ApiOperation({
    summary: 'upload multiple files with form data for application',
  })
  @Post('requisition-create')
  @ApiFiles()
  async uploadFile(
    @Body() requisition_data: testReqDto,
    @UserPayload() user_data: JwtPayloadInterface,
  ) {
    const data = await this.testService.testReqCreate(
      requisition_data,
      user_data,
    );
    return { message: 'success', result: data };
  }

  @Post('audit')
  async updateData(
    @Body() data: any,
    @UserPayload() user_data: JwtPayloadInterface,
  ) {
    const insert_data = await this.testService.insertAuditTrail(data);
    console.log(insert_data);
    const update_data = await this.testService.updateAuditTrail(
      data,
      user_data,
    );

    return { message: 'successfull', result: update_data };
  }

  @Post('report')
  async getReport(
    @Body() data: any,
    @UserPayload() user_data: JwtPayloadInterface,
    @Res() res,
  ) {
    const fileName = await this.testService.getReport(user_data);
    return {
      message: 'success',
      result: res.download(
        `./public/uploads/${fileName.storeName}`,
        fileName.downloadName,
      ),
    };
  }

  @Post('status')
  async getStatus(
    @Body() data: any,
    @UserPayload() user_data: JwtPayloadInterface,
  ) {
    const sData = await this.idlogic.getStatus(user_data.company_id, data.slug);
    return { message: 'success', result: sData };
  }

  @Get('set-user-filter-array')
  async setUserFilterArray(@UserPayload() user_data: JwtPayloadInterface) {
    const qresult = await this.sessionFilter.setUserFilterArray(user_data);
    return { message: 'success', result: qresult };
  }

  @Get('set-permission-filter-array')
  async setPermissionFilterArray(
    @UserPayload() user_data: JwtPayloadInterface,
  ) {
    const qresult = await this.sessionFilter.setPermissionFilterArray(
      user_data,
    );
    console.log('jak00');
    console.log(qresult);
    return { message: 'success', result: qresult };
  }

  @Get('test-autovoucher')
  async testAutovoucher(@UserPayload() user_data: JwtPayloadInterface) {
    const post_data = {
      event: 'payment_schedule_approved',
      product: 'payment_schedule',
      preview: 1,
      refid: 100152,
      amount: 0,
      voucherno: '',
      voucherdate: '',
      ref: 'Rental Schedule Generate',
      narration: 'Rental Schedule Generate',
      user_data: user_data,
    };
    const result = await this.autovoucher.GenerateAutoVoucher(post_data);
    //console.trace(result);
    return { message: 'success', result: result };
  }

  @Get('test-insert')
  async testInsert() {
    const dataObject = [
      {
        test_id: 19,
        test_name: 'jak',
        test_address: 'banani',
      },
      {
        test_id: 20,
        test_name: 'jak2',
        test_address: 'banani2',
      },
    ];
    const data = {
      table: 'test',
      data_object: dataObject,
      return_column: 'test_name',
    };
    const result = await this.cmn.dbInsert(data);
    console.log(result);
    return { message: 'success', result: result };
  }

  @Get('test-update')
  async testUpdate() {
    const data_object = {
      test_id: 17,
      test_name: 'jak17',
      test_address: 'banani17',
    };
    const where = {
      test_id: 13,
      test_name: 'jak',
      test_address: 'banani',
    };

    const data = {
      table: 'test',
      data_object: data_object,
      where: where,
    };
    const result = await this.cmn.dbUpdate(data);
    return { message: 'success', result: result };
  }

  @Get('test-delete')
  async testDelete() {
    const where = {
      test_id: 17,
      test_name: 'jak17',
      test_address: 'banani17',
    };

    const data = {
      table: 'test',
      where: where,
    };
    const result = await this.cmn.dbDelete(data);
    console.log(result);
    return { message: 'success', result: result };
  }

  // @Get('test-transaction')
  // async testTransaction() {
  //   const where = {
  //     test_id: 17,
  //     test_name: 'jak17',
  //     test_address: 'banani17',
  //   };

  //   const data = {
  //     table: 'test',
  //     where: where,
  //   };
  //   const result = await this.cmn.dbDelete(data);
  //   console.log(result);
  //   return { message: 'success', result: result };
  // }
}
