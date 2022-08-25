import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { KNEX_CONNECTION } from 'src/knexmodule';
import { JwtAuthGuard } from '../auth/guards';
import { JwtPayloadInterface } from '../auth/interfaces';
import { UserPayload } from '../utils/decorator';
import { DelegationConfService } from './delegation-conf.service';
import { UpdateDelegationDto } from './dto/delegation-Update.dto';
import { delegationSubmission } from './dto/delegation_Submission.dto';

//swagger
@ApiTags('Delegation Conf')
@ApiBearerAuth('jwt')
//apsis engine guards
@UseGuards(JwtAuthGuard)
@Controller({
  path: 'delegation-conf',
  version: '1',
})
export class DelegationConfController {
  constructor(
    private readonly delegationConfService: DelegationConfService,
    @Inject(KNEX_CONNECTION) private readonly knex,
  ) {}

  @Get('delegation-set/:slug')
  async delegationSet(
    @Param('slug') slug,
    @UserPayload() user_data: JwtPayloadInterface,
  ) {
    //const slug = 'asset_code';
    const result = await this.delegationConfService.delegationConfSet(
      slug,
      user_data,
    );
    return { messag: 'Master Form Data', result: result };
  }

  @Get('dlms')
  async dlms() {
    const result = await this.delegationConfService.getDlms();
    return { messag: 'Master Form Data', result: result };
  }

  @Get('delegation-view/:slug')
  async delegationView(
    @Param('slug') slug,
    @UserPayload() user_data: JwtPayloadInterface,
  ) {
    const result = await this.delegationConfService.getDelegationView(
      slug,
      user_data,
    );
    return { messag: 'Master Form Data', result: result };
  }

  @Post('delegation-details')
  async delegationDetails(
    @Body() post,
    @UserPayload() user_data: JwtPayloadInterface,
  ) {
    const result = await this.delegationConfService.delegationDetails(
      post,
      user_data,
    );
    return { messag: 'Master Form Data', result: result };
  }

  @Post('delegation-submission')
  async delegationSubmission(
    @Body() body: delegationSubmission,
    @UserPayload() user_data: JwtPayloadInterface,
  ) {
    const result = await this.delegationConfService.delegationSubmission(
      body,
      user_data,
    );
    if (result?.message) {
      return { message: result.message, result: {} };
    }
    return { message: 'Submission Successfull!!!', result: result };
  }
  @Patch('delegation-update')
  async delegationUpdate(
    @Body() body: UpdateDelegationDto,
    @UserPayload() user_data: JwtPayloadInterface,
  ) {
    const result = await this.delegationConfService.delegationUpdate(
      body,
      user_data,
    );
    // if (result?.message) {
    //   return { message: result.message, result: {} };
    // }
    return { message: 'Update Successfull!!!', result: result };
  }
}
