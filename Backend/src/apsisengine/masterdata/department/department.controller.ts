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
import { DepartmentService } from './department.service';
import { CreatedepartmentDto } from './dto/create-department.dto';
import { UpdatedepartmentDto } from './dto/update-department.dto';
import { AuthId } from 'src/apsisengine/utils/decorator';
import { CompanyId } from 'src/apsisengine/utils/decorator/company-id.decorator';
import Helpers from 'src/apsisengine/common/helpers/apsisHelper';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/apsisengine/auth/guards';

@ApiTags('department')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
@Controller({
  path: 'department',
  version: '1',
})
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Post()
  async create(
    @Body() createdepartmentdto: CreatedepartmentDto,
    @AuthId() userId: number,
    @CompanyId() companyId: number,
  ) {
    const payload = createdepartmentdto;
    payload.created_by = userId;
    payload.created_at = Helpers.mysql_date();
    payload.company_id = companyId;
    const data = await this.departmentService.create(payload);
    return { message: 'successfull', result: data };
  }

  @Get()
  async findAll() {
    const data = await this.departmentService.findAll();
    return { message: 'successfull', result: data };
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.departmentService.findOne(+id);
    return { message: 'successfull', result: data };
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updatedepartmentdto: UpdatedepartmentDto,
    @AuthId() userId: number,
    @CompanyId() companyId: number,
  ) {
    const payload = updatedepartmentdto;
    payload.updated_by = userId;
    payload.updated_at = Helpers.mysql_date();
    payload.company_id = companyId;
    const data = await this.departmentService.update(id, payload);
    return { message: 'successfull', result: data };
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @AuthId() CurrentuserId: number) {
    const userId = CurrentuserId;
    const time = Helpers.mysql_date();
    const data = await this.departmentService.remove(id, userId, time);
    return { message: 'successfull', result: data };
  }
}
