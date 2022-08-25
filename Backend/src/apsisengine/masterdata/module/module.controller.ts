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
import { ModuleService } from './module.service';
import { CreatemoduleDto } from './dto/create-module.dto';
import { UpdatemoduleDto } from './dto/update-module.dto';
import { AuthId } from 'src/apsisengine/utils/decorator';

import Helpers from 'src/apsisengine/common/helpers/apsisHelper';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/apsisengine/auth/guards';

@ApiTags('module')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
@Controller({
  path: 'module',
  version: '1',
})
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  @Post()
  async create(
    @Body() createmoduledto: CreatemoduleDto,
    @AuthId() userId: number,
  ) {
    const payload = createmoduledto;
    payload.created_by = userId;
    payload.created_at = Helpers.mysql_date();

    const data = await this.moduleService.create(payload);
    return { message: 'successfull', result: data };
  }

  @Get()
  async findAll() {
    const data = await this.moduleService.findAll();
    return { message: 'successfull', result: data };
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.moduleService.findOne(+id);
    return { message: 'successfull', result: data };
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updatemoduledto: UpdatemoduleDto,
    @AuthId() userId: number,
  ) {
    const payload = updatemoduledto;
    payload.updated_by = userId;
    payload.updated_at = Helpers.mysql_date();

    const data = await this.moduleService.update(id, payload);
    return { message: 'successfull', result: data };
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @AuthId() CurrentuserId: number) {
    const userId = CurrentuserId;
    const time = Helpers.mysql_date();
    const data = await this.moduleService.remove(id, userId, time);
    return { message: 'successfull', result: data };
  }
}
