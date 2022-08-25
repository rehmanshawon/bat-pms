import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { IdlogicService } from 'src/apsisengine/idlogic/idlogic.oracle.service';
import { CompanyId } from 'src/apsisengine/utils/decorator';
import { JwtAuthGuard } from '../auth/guards';

@ApiTags('idlogic')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
@Controller({
  path: 'idlogic',
  version: '1',
})
export class IdLogicController {
  constructor(private readonly idlogic: IdlogicService) {}

  @Post()
  async getIdLogic(@Body() body, @CompanyId() company_id: number) {
    const idlogicData = {
      slug: body.slug,
      companyId: company_id,
      date: body.date,
      data: body.data,
    };
    const data = await this.idlogic.generateId(idlogicData);
    return { message: 'success', result: data };
  }
}
