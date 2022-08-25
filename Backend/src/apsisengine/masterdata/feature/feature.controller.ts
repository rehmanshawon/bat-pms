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
import { FeatureService } from './feature.service';
import { CreatefeatureDto } from './dto/create-feature.dto';
import { UpdatefeatureDto } from './dto/update-feature.dto';
import { AuthId } from 'src/apsisengine/utils/decorator';

import Helpers from 'src/apsisengine/common/helpers/apsisHelper';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/apsisengine/auth/guards';

@ApiTags('feature')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
@Controller({
  path: 'feature',
  version: '1',
})
export class FeatureController {
  constructor(private readonly featureService: FeatureService) {}

  @Post()
  async create(
    @Body() createfeaturedto: CreatefeatureDto,
    @AuthId() userId: number,
  ) {
    const payload = createfeaturedto;
    payload.created_by = userId;
    payload.created_at = Helpers.mysql_date();

    const data = await this.featureService.create(payload);
    return { message: 'successfull', result: data };
  }

  @Get()
  async findAll() {
    const data = await this.featureService.findAll();
    return { message: 'successfull', result: data };
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.featureService.findOne(+id);
    return { message: 'successfull', result: data };
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updatefeaturedto: UpdatefeatureDto,
    @AuthId() userId: number,
  ) {
    const payload = updatefeaturedto;
    payload.updated_by = userId;
    payload.updated_at = Helpers.mysql_date();

    const data = await this.featureService.update(id, payload);
    return { message: 'successfull', result: data };
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @AuthId() CurrentuserId: number) {
    const userId = CurrentuserId;
    const time = Helpers.mysql_date();
    const data = await this.featureService.remove(id, userId, time);
    return { message: 'successfull', result: data };
  }
}
