/* dependencies**/
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
/* decorators**/
import { AuthId, UserPayload } from 'src/apsisengine/utils/decorator';
/* guards**/
import { JwtAuthGuard } from '../auth/guards';
import { JwtPayloadInterface } from '../auth/interfaces';
/** services**/
import { ModuleChangerService } from './index';

//swagger doc
@ApiTags('Module changer')
@ApiBearerAuth('jwt')
//guards
@UseGuards(JwtAuthGuard)
@Controller({
  //route name
  path: 'modulechanger',
  //api version(v1)
  version: '1',
})
export class ModulechangerController {
  constructor(private readonly moduleChangerService: ModuleChangerService) {}

  //get list of authorized module
  @Get('authorized-list')
  async authorizedModuleList(@UserPayload() userData: JwtPayloadInterface) {
    const authorizedModuleListData =
      await this.moduleChangerService.moduleListData(userData);
    return { message: 'successfull', result: authorizedModuleListData };
  }

  //module changer route
  @Get(':id')
  async moduleChangeLoader(
    @Param('id') module_id: number,
    @AuthId() user_id: number,
  ) {
    const module_data = await this.moduleChangerService.moduleChangerData(
      module_id,
      user_id,
    );

    return { message: 'successfull', result: module_data };
  }
}
