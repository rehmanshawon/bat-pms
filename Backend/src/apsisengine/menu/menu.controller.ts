/**dependencies**/
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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
/**services**/
import { MenuService } from './menu.service';
/**dto**/
import { CreatemenuDto } from './dto/create-menu.dto';
import { UpdatemenuDto } from './dto/update-menu.dto';
/**guards**/
import { JwtAuthGuard } from 'src/apsisengine/auth/guards';
/**Global data**/
import { AuthId, UserPayload } from 'src/apsisengine/utils/decorator';
import { CompanyId } from 'src/apsisengine/utils/decorator/company-id.decorator';
import Helpers from 'src/apsisengine/common/helpers/apsisHelper';
import { JwtPayloadInterface } from '../auth/interfaces';
import Common_function from 'src/global/common_function.service';

//swagger doc
@ApiTags('menu')
@ApiBearerAuth('jwt')
//apsis engine guards
@UseGuards(JwtAuthGuard)
@Controller({
  path: 'menu',
  version: '1',
})
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  async create(
    @Body() createmenudto: CreatemenuDto,
    @AuthId() userId: number,
    @CompanyId() companyId: number,
  ) {
    const payload = createmenudto;
    payload.created_by = userId;
    payload.created_at = Helpers.mysql_date();
    payload.company_id = companyId;
    payload.parent_menu_id = 0;
    payload.sort_number = 0;

    const data = await this.menuService.create(payload);
    return { message: 'successfull', result: data };
  }

  @Post('updateMenu')
  async UpdateMenu(
    @Body() createmenudto: CreatemenuDto,
    @UserPayload() userPayload: JwtPayloadInterface,
  ) {
    const data = await this.menuService.UpdateMenu(createmenudto, userPayload);
    return { message: 'successfull', result: data };
  }

  @Post('updateMenuStructure')
  async updateMenu(
    @Body() updatemenudto: UpdatemenuDto,
    @UserPayload() userPayload: JwtPayloadInterface,
  ) {
    const data = await this.menuService.createNewStructure(
      updatemenudto,
      userPayload,
    );
    return { message: 'Update Successfull!!!', result: data };
  }

  @Post('menuPrivilege')
  async getMenuPrivilege(
    @Body() request,
    @UserPayload() userPayload: JwtPayloadInterface,
  ) {
    const data = await this.menuService.getMenuPrivilege(request, userPayload);
    return { message: 'Successfull!!!', result: data };
  }

  @Post('updateMenuPrivilege')
  async updateMenuPrivilege(
    @Body() updatemenudto: UpdatemenuDto,
    @UserPayload() userPayload: JwtPayloadInterface,
  ) {
    const data = await this.menuService.updateMenuPrivilege(
      updatemenudto,
      userPayload,
    );
    return { message: 'Successfull!!!', result: data };
  }

  @Get()
  async findAll() {
    const data = await this.menuService.findAll();
    return { message: 'successfull', result: data };
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.menuService.findOne(+id);
    return { message: 'successfull', result: data };
  }

  @Get('menuInfo/:id')
  async findMenuInfo(@Param('id') id: number) {
    const data = await this.menuService.findMenuInfo(+id);
    return { message: 'successfull', result: data };
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updatemenudto: UpdatemenuDto,
    @AuthId() userId: number,
    @CompanyId() companyId: number,
  ) {
    const payload = updatemenudto;
    payload.updated_by = userId;
    payload.updated_at = Helpers.mysql_date();
    payload.company_id = companyId;
    const data = await this.menuService.update(id, payload);
    return { message: 'successfull', result: data };
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @AuthId() CurrentuserId: number) {
    const userId = CurrentuserId;
    const data = await this.menuService.remove(id, userId);
    return { message: 'successfull', result: data };
  }
}
