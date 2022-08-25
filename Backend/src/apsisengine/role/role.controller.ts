import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { DeleteRoleDto } from './dto/delete-role.dto';
import { UserPayload } from 'src/apsisengine/utils/decorator';
import { JwtPayloadInterface } from 'src/apsisengine/auth/interfaces';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/apsisengine/auth/guards';

@ApiTags('role')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
@Controller({
  path: 'role',
  version: '1',
})
export class RoleController {
  constructor(private readonly roleService: RoleService) {}
  // @ApiOperation({
  //   summary: 'create a new role',
  //   description:
  //     'this role api is responsible for creating a role by post request. to make post request check json format properly',
  // })
  // @Post()
  // async create(
  //   @Body() createroledto: CreateRoleDto,
  //   @UserPayload() userPayload: JwtPayloadInterface,
  // ) {
  //   const data = await this.roleService.create(createroledto, userPayload);
  //   return { message: data.message, result: data.data };
  // }
  // @ApiOperation({
  //   summary: 'Show a single role',
  //   description:
  //     'this role api is responsible for fetching a role from database',
  // })
  // @Get(':id')
  // async findOne(@Param('id') id: number) {
  //   const data = await this.roleService.findOne(+id);
  //   return { message: data.message, result: data.data };
  // }

  // @ApiOperation({
  //   summary: 'Delete a role',
  //   description:
  //     'this role api is responsible for deleting a role by corresponding id.',
  // })
  // @Patch('/delete')
  // async remove(
  //   @Body() ids: DeleteRoleDto,
  //   @UserPayload() userPayload: JwtPayloadInterface,
  // ) {
  //   const data = await this.roleService.remove(ids, userPayload);
  //   return { message: data.message, result: data.data };
  // }

  // @ApiOperation({
  //   summary: 'Update a role',
  //   description:
  //     'this role api is responsible for updating a role by patch request. to make patch request check json format properly',
  // })
  // @Patch(':id')
  // async update(
  //   @Param('id') id: number,
  //   @Body() updateroledto: UpdateRoleDto,
  //   @UserPayload() userPayload: JwtPayloadInterface,
  // ) {
  //   const data = await this.roleService.update(updateroledto, userPayload, id);
  //   return { message: data.message, result: data.data };
  // }
}
