import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { EngineConfigService } from './engineconfig.service';
import { CreateConfigDto } from './dto/create-config.dto';
import { UpdateConfigDto } from './dto/update-config.dto';
import { DeleteConfigDto } from './dto/delete-config.dto';
import { UserPayload } from 'src/apsisengine/utils/decorator';
import { JwtPayloadInterface } from 'src/apsisengine/auth/interfaces';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/apsisengine/auth/guards';

@ApiTags('config')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
@Controller({
  path: 'config',
  version: '1',
})
export class EngineConfigController {
  constructor(private readonly configService: EngineConfigService) {}
  // @ApiOperation({
  //   summary: 'create a new config',
  //   description:
  //     'this config api is responsible for creating a config by post request. to make post request check json format properly',
  // })
  // @Post()
  // async create(
  //   @Body() createconfigdto: CreateConfigDto[],
  //   @UserPayload() userPayload: JwtPayloadInterface,
  // ) {
  //   const data = await this.configService.create(createconfigdto, userPayload);
  //   return { message: data.message, result: data.data };
  // }

  // @ApiOperation({
  //   summary: 'Show a single config',
  //   description:
  //     'this config api is responsible for fetching a config from database',
  // })
  // @Get('get-by-slug/:slug')
  // async getBySlug(
  //   @Param('slug') slug: string,
  //   @UserPayload() userPayload: JwtPayloadInterface,
  // ) {
  //   const data = await this.configService.lookupSlug(
  //     slug,
  //     userPayload.company_id,
  //   );
  //   return { message: data.message, result: data.data };
  // }

  // @ApiOperation({
  //   summary: 'Show a single config',
  //   description:
  //     'this config api is responsible for fetching a config from database',
  // })
  // @Get('get-slugs')
  // async getSlugs(@UserPayload() userPayload: JwtPayloadInterface) {
  //   const data = await this.configService.getSlugs(userPayload);
  //   return { message: data.message, result: data.data };
  // }

  // @ApiOperation({
  //   summary: 'Show a single config',
  //   description:
  //     'this config api is responsible for fetching a config from database',
  // })
  // @Get(':id')
  // async findOne(@Param('id') id: number) {
  //   const data = await this.configService.findOne(+id);
  //   return { message: data.message, result: data.data };
  // }

  // @ApiOperation({
  //   summary: 'Delete a config',
  //   description:
  //     'this config api is responsible for deleting a config by corresponding id.',
  // })
  // @Patch('/delete')
  // async remove(
  //   @Body() ids: DeleteConfigDto,
  //   @UserPayload() userPayload: JwtPayloadInterface,
  // ) {
  //   const data = await this.configService.remove(ids, userPayload);
  //   return { message: data.message, result: data.data };
  // }

  // @ApiOperation({
  //   summary: 'Update a config',
  //   description:
  //     'this config api is responsible for updating a config by patch request. to make patch request check json format properly',
  // })
  // @Patch(':id')
  // async update(
  //   @Param('id') id: number,
  //   @Body() updateconfigdto: UpdateConfigDto,
  //   @UserPayload() userPayload: JwtPayloadInterface,
  // ) {
  //   const data = await this.configService.update(
  //     updateconfigdto,
  //     userPayload,
  //     id,
  //   );
  //   return { message: data.message, result: data.data };
  // }
}
