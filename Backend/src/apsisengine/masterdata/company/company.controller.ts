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
import { CompanyService } from './company.service';
import { CreatecompanyDto } from './dto/create-company.dto';
import { UpdatecompanyDto } from './dto/update-company.dto';
import { AuthId } from 'src/apsisengine/utils/decorator';
import Helpers from 'src/apsisengine/common/helpers/apsisHelper';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/apsisengine/auth/guards';
import Common_function from 'src/global/common_function.service';

@ApiTags('company')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
@Controller({
  path: 'company',
  version: '1',
})
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
    private readonly helpers: Common_function,
  ) {}

  @Post()
  async create(
    @Body() createcompanydto: CreatecompanyDto,
    @AuthId() userId: number,
  ) {
    const payload: any = createcompanydto;
    payload.created_by = userId;
    payload.created_at = this.helpers.cmnDatetime();
    const data = await this.companyService.create(payload);
    return { message: 'successfull', result: data };
  }

  @Get()
  async findAll() {
    const data = await this.companyService.findAll();
    return { message: 'successfull', result: data };
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.companyService.findOne(+id);
    return { message: 'successfull', result: data };
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updatecompanydto: UpdatecompanyDto,
    @AuthId() userId: number,
  ) {
    const payload: any = updatecompanydto;
    payload.updated_by = userId;
    payload.updated_at = this.helpers.cmnDatetime();
    const data = await this.companyService.update(id, payload);
    return { message: 'successfull', result: data };
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @AuthId() CurrentuserId: number) {
    const userId = CurrentuserId;
    const time = this.helpers.cmnDatetime();
    const data = await this.companyService.remove(id, userId, time);
    return { message: 'successfull', result: data };
  }
}
