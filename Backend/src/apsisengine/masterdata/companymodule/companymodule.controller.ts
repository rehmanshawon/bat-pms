import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CompanymoduleService } from './companymodule.service';
import { CreatecompanymoduleDto } from './dto/create-companymodule.dto';
import { UpdatecompanymoduleDto } from './dto/update-companymodule.dto';
import { AuthId } from 'src/apsisengine/utils/decorator';
import { CompanyId } from 'src/apsisengine/utils/decorator/company-id.decorator';
import Helpers from 'src/apsisengine/common/helpers/apsisHelper';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/apsisengine/auth/guards';

@ApiTags('companymodule')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
@Controller({
  path: 'companymodule',
  version: '1',
})
export class CompanymoduleController {
  constructor(private readonly companymoduleService: CompanymoduleService) {}

  @Post()
  async create(
    @Body() createcompanymoduledto: CreatecompanymoduleDto,
    @AuthId() userId: number,
    @CompanyId() companyId: number,
  ) {
    const payload = createcompanymoduledto;
    payload.company_id = companyId;
    const data = await this.companymoduleService.create(payload);
    return { message: 'successfull', result: data };
  }

  @Get()
  async findAll() {
    const data = await this.companymoduleService.findAll();
    return { message: 'successfull', result: data };
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.companymoduleService.findOne(+id);
    return { message: 'successfull', result: data };
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updatecompanymoduledto: UpdatecompanymoduleDto,
    @AuthId() userId: number,
    @CompanyId() companyId: number,
  ) {
    const payload = updatecompanymoduledto;
    payload.company_id = companyId;
    const data = await this.companymoduleService.update(id, payload);
    return { message: 'successfull', result: data };
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @AuthId() CurrentuserId: number) {
    const userId = CurrentuserId;
    const time = Helpers.mysql_date();
    const data = await this.companymoduleService.remove(id, userId, time);
    return { message: 'successfull', result: data };
  }
}
