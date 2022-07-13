import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { DynamicJsonService } from './dynamic_json.service';
import { CreateDynamicJsonDto } from './dto/create-dynamic_json.dto';
import { UpdateDynamicJsonDto } from './dto/update-dynamic_json.dto';
import { DeleteDynamicJsonDto } from './dto/delete-dynamic_json.dto';
import { UserPayload } from 'src/apsisengine/utils/decorator';
import { JwtPayloadInterface } from 'src/apsisengine/auth/interfaces';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/apsisengine/auth/guards';
import { Request } from 'express';
@ApiTags('dynamic_json')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
@Controller({
  path: 'dynamic_json',
  version: '1',
})
export class DynamicJsonController {
  constructor(private readonly dynamicJsonService: DynamicJsonService) {}
  // @ApiOperation({
  //   summary: 'create a new dynamic_json',
  //   description:
  //     'this dynamic_json api is responsible for creating a dynamic_json by post request. to make post request check json format properly',
  // })
  // @Post()
  // async create(
  //   @Body() request: Request,
  //   @UserPayload() userPayload: JwtPayloadInterface,
  // ) {
  //   const data = await this.dynamicJsonService.create(request, userPayload);
  //   return { message: 'Successfull!!!', result: data };
  // }
  // @ApiOperation({
  //   summary: 'Show a single dynamic_json',
  //   description:
  //     'this dynamic_json api is responsible for fetching a dynamic_json from database',
  // })
  // @Get(':id')
  // async findOne(@Param('id') id: string) {
  //   const data = await this.dynamicJsonService.findOne(id);
  //   return { message: 'Successfull!!', result: data };
  // }

  // @Get()
  // async findAll() {
  //   const data = await this.dynamicJsonService.findAll();
  //   return { message: data.message, result: data.data };
  // }

  // @ApiOperation({
  //   summary: 'Delete a dynamic_json',
  //   description:
  //     'this dynamic_json api is responsible for deleting a dynamic_json by corresponding id.',
  // })
  // @Patch('/delete')
  // async remove(
  //   @Body() ids: DeleteDynamicJsonDto,
  //   @UserPayload() userPayload: JwtPayloadInterface,
  // ) {
  //   const data = await this.dynamicJsonService.remove(ids, userPayload);
  //   return { message: data.message, result: data.data };
  // }

  // @ApiOperation({
  //   summary: 'Update a dynamic_json',
  //   description:
  //     'this dynamic_json api is responsible for updating a dynamic_json by patch request. to make patch request check json format properly',
  // })
  // @Patch(':id')
  // async update(
  //   @Param('id') id: number,
  //   @Body() updatedynamicjsondto: UpdateDynamicJsonDto,
  //   @UserPayload() userPayload: JwtPayloadInterface,
  // ) {
  //   const data = await this.dynamicJsonService.update(
  //     updatedynamicjsondto,
  //     userPayload,
  //     id,
  //   );
  //   return { message: data.message, result: data.data };
  // }
}
