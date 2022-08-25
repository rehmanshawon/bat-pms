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
import { DivisionService } from './division.service';
import { CreatedivisionDto } from './dto/create-division.dto';
import { UpdatedivisionDto } from './dto/update-division.dto';
import { AuthId } from 'src/apsisengine/utils/decorator';
import { CompanyId } from 'src/apsisengine/utils/decorator/company-id.decorator';
import Helpers from 'src/apsisengine/common/helpers/apsisHelper';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/apsisengine/auth/guards';

@ApiTags('division')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
@Controller({
  path: 'division',
  version: '1',
})
export class DivisionController {
  constructor(private readonly divisionService: DivisionService) {}

  @Post()
  async create(
    @Body() createdivisiondto: CreatedivisionDto,
    @AuthId() userId: number,
    @CompanyId() companyId: number,
  ) {
    const payload = createdivisiondto;
    payload.created_by = userId;
    payload.created_at = Helpers.mysql_date();
    payload.company_id = companyId;
    const data = await this.divisionService.create(payload);
    return { message: 'successfull', result: data };
  }

  @Get()
  async findAll() {
    const data = await this.divisionService.findAll();
    return { message: 'successfull', result: data };
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.divisionService.findOne(+id);
    return { message: 'successfull', result: data };
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updatedivisiondto: UpdatedivisionDto,
    @AuthId() userId: number,
    @CompanyId() companyId: number,
  ) {
    const payload = updatedivisiondto;
    payload.updated_by = userId;
    payload.updated_at = Helpers.mysql_date();
    payload.company_id = companyId;
    const data = await this.divisionService.update(id, payload);
    return { message: 'successfull', result: data };
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @AuthId() CurrentuserId: number) {
    const userId = CurrentuserId;
    const time = Helpers.mysql_date();
    const data = await this.divisionService.remove(id, userId, time);
    return { message: 'successfull', result: data };
  }
}
