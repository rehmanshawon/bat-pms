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
import { BranchService } from './branch.service';
import { CreatebranchDto } from './dto/create-branch.dto';
import { UpdatebranchDto } from './dto/update-branch.dto';
import { AuthId } from 'src/apsisengine/utils/decorator';
import { CompanyId } from 'src/apsisengine/utils/decorator/company-id.decorator';
import Helpers from 'src/apsisengine/common/helpers/apsisHelper';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/apsisengine/auth/guards';
import Common_function from 'src/global/common_function.service';

@ApiTags('branch')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
@Controller({
  path: 'branch',
  version: '1',
})
export class BranchController {
  constructor(
    private readonly branchService: BranchService,
    private readonly helpers: Common_function,
  ) {}

  @Post()
  async create(
    @Body() createbranchdto: CreatebranchDto,
    @AuthId() userId: number,
    @CompanyId() companyId: number,
  ) {
    const payload: any = createbranchdto;
    payload.created_by = userId;
    payload.created_at = this.helpers.cmnDatetime();
    payload.company_id = companyId;
    const data = await this.branchService.create(payload);
    return { message: 'successfull', result: data };
  }

  @Get()
  async findAll() {
    const data = await this.branchService.findAll();
    return { message: 'successfull', result: data };
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.branchService.findOne(+id);
    return { message: 'successfull', result: data };
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updatebranchdto: UpdatebranchDto,
    @AuthId() userId: number,
    @CompanyId() companyId: number,
  ) {
    const payload: any = updatebranchdto;
    payload.updated_by = userId;
    payload.updated_at = this.helpers.cmnDatetime();
    payload.company_id = companyId;
    const data = await this.branchService.update(id, payload);
    return { message: 'successfull', result: data };
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @AuthId() CurrentuserId: number) {
    const userId = CurrentuserId;
    const time = this.helpers.cmnDatetime();
    const data = await this.branchService.remove(id, userId, time);
    return { message: 'successfull', result: data };
  }
}
