import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards';
import { JwtPayloadInterface } from '../auth/interfaces';
import { UserPayload } from '../utils/decorator';
import { MasterGridDto } from './dto';
import { MasterGridTitleDto } from './dto/master-grid-title.dto';
import { CreateMastergridDto } from './dto/mastergridCreateDto';
import { DeleteMasterGridDto } from './dto/masterGridDeleteDto';
import { UpdateMasterGridDto } from './dto/masterGridUpdateDto';
import { MasterGridService } from './index';

//swagger
@ApiTags('Master Grid')
@ApiBearerAuth('jwt')
//apsis engine guards
@UseGuards(JwtAuthGuard)
@Controller({
  path: 'master-grid',
  version: '1',
})
export class MasterGridController {
  constructor(private readonly masterGridService: MasterGridService) {}

  // @Get('grid-data')
  // async gridData() {
  //   const idlogicData = {
  //     slug: 'asset_code',
  //     date: null,
  //     data: {
  //       BR: 20,
  //     },
  //   };
  //   const data = await this.idlogic.generateId(idlogicData);
  //   return { message: 'success', result: data };
  // }
  @Post('grid-data')
  async gridData(
    @Body() masterGridDataDto: MasterGridDto,
    @UserPayload() user_data: JwtPayloadInterface,
  ) {
    const data = await this.masterGridService.gridData(
      masterGridDataDto,
      user_data,
    );
    return { messag: 'Master Form Data', result: data };
  }

  @Post('grid-title')
  async gridTitle(
    @Body() masterGridTitleDto: MasterGridTitleDto,
    @UserPayload() user_data: JwtPayloadInterface,
  ) {
    const data = await this.masterGridService.gridtitle(
      masterGridTitleDto,
      user_data,
    );
    return { messag: 'Master Form Data', result: data };
  }

  @Get('search-panel/:slug')
  async searchPanel(@Param('slug') slug) {
    const result = await this.masterGridService.getSearchPanel(slug);
    return { messag: 'Successfull', result: result };
  }

  @Post('export-xlsx')
  async exportXlsx(
    @Body() masterGridTitleDto: MasterGridTitleDto,
    @UserPayload() user_data: JwtPayloadInterface,
  ) {
    const data = await this.masterGridService.exportXlsx(
      masterGridTitleDto,
      user_data,
    );
    return {
      message: 'success',
      result: `${process.env.PUBLIC_API_URL_FILE}public/uploads/${data.storeName}`,
    };
  }
  @Get('table-info')
  async getTableInfo() {
    const result = await this.masterGridService.getPrimaryKeyTable();
    return { messag: 'Successfull', result: result };
  }
  @Post('create')
  async createMasterGrid(
    @Body() mastergridData: CreateMastergridDto,
    @UserPayload() user_data: JwtPayloadInterface,
  ) {
    const data = await this.masterGridService.mastergridCreate(
      mastergridData,
      user_data,
    );
    return { message: data.message, result: data.data };
  }

  @Get('/data/:id')
  async getSingleData(
    @Param('id') id: number,
    @UserPayload() user_data: JwtPayloadInterface,
  ) {
    const data = await this.masterGridService.getMastergridData(id, user_data);
    return { message: data.message, result: data.data };
  }

  @Patch('/data/:id')
  async updateData(
    @Param('id') id: number,
    @UserPayload() user_data: JwtPayloadInterface,
    @Body() updateableData: UpdateMasterGridDto,
  ) {
    const data = await this.masterGridService.updateMasterGrid(
      id,
      updateableData,
      user_data,
    );
    return { message: data.message, result: data.data };
  }
  @Patch('/delete')
  async remove(
    @Body() ids: DeleteMasterGridDto,
    @UserPayload() userPayload: JwtPayloadInterface,
  ) {
    const data = await this.masterGridService.remove(ids, userPayload);
    return { message: 'success', result: data };
  }
}
