/**dependencies */
import {
  Controller,
  Body,
  Post,
  UseGuards,
  Get,
  Param,
  Patch,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
/**guards**/
import { JwtAuthGuard } from '../auth/guards';
import { JwtPayloadInterface } from '../auth/interfaces';
import { UserPayload } from '../utils/decorator';
/**service**/
import { DropdownService } from './index';
/**dto**/
import { DropdownDto } from './dto';
import { UpdateDropdownUiDto } from './dto/update-dropdownUi.dto';
import { CreateDropdownUiDto } from './dto/create-dropdownUi.dto';
import { DeleteDropdownUiDto } from './dto/delete-dropdownUi.dto';

@ApiTags('Dropdown')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
@Controller({
  path: 'dropdown',
  version: '1',
})
export class DropdownController {
  constructor(private readonly dropdownService: DropdownService) {}
  //dropdown
  //swagger doc
  // @ApiBearerAuth('jwt')
  //guards
  // @UseGuards(JwtAuthGuard)
  //route name
  @Post('dropdowndata')
  async getDropDown(
    @Body() dropdownDto: DropdownDto,
    @UserPayload() user_data: JwtPayloadInterface,
  ) {
    const data = await this.dropdownService.getDropdownData(
      dropdownDto,
      user_data,
    );
    return { messag: 'Dropdown Data', result: data };
  }

  @Post()
  async create(
    @Body() createdropdownuidto: CreateDropdownUiDto,
    @UserPayload() userPayload: JwtPayloadInterface,
  ) {
    const data = await this.dropdownService.create(
      createdropdownuidto,
      userPayload,
    );
    return { message: data.message, result: data.data };
  }
  @ApiOperation({
    summary: 'Show a single dropdownUi',
    description:
      'this dropdownUi api is responsible for fetching a dropdownUi from database',
  })
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.dropdownService.findOne(+id);
    return { message: data.message, result: data.data };
  }

  @ApiOperation({
    summary: 'Delete a dropdownUi',
    description:
      'this dropdownUi api is responsible for deleting a dropdownUi by corresponding id.',
  })
  @Patch('/delete')
  async remove(
    @Body() ids: DeleteDropdownUiDto,
    @UserPayload() userPayload: JwtPayloadInterface,
  ) {
    const data = await this.dropdownService.remove(ids, userPayload);
    return { message: data.message, result: data.data };
  }

  @ApiOperation({
    summary: 'Update a dropdownUi',
    description:
      'this dropdownUi api is responsible for updating a dropdownUi by patch request. to make patch request check json format properly',
  })
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updatedropdownuidto: UpdateDropdownUiDto,
    @UserPayload() userPayload: JwtPayloadInterface,
  ) {
    const data = await this.dropdownService.update(
      updatedropdownuidto,
      userPayload,
      id,
    );
    return { message: data.message, result: data.data };
  }
}
