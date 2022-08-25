/**dependencies */
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
/**guards**/
import { JwtAuthGuard } from '../auth/guards';
/**dto**/
import { MasterformDto } from './dto';
/**services */
import { MasterFormService } from './masterform.service';
/**Global data**/
import { UserPayload } from '../utils/decorator';
import { JwtPayloadInterface } from '../auth/interfaces';

@ApiTags('Master Form')
@Controller({
  path: 'masterform',
  version: '1',
})
export class MasterFormController {
  constructor(private readonly masterFormService: MasterFormService) {}
  //master form
  //swagger doc
  @ApiBearerAuth('jwt')
  @ApiBody({ type: MasterformDto })
  //guards
  @UseGuards(JwtAuthGuard)
  //route name
  @Post('getformdata')
  async getMasterForm(
    @Body() masterformDto: MasterformDto,
    @UserPayload() userPayload: JwtPayloadInterface,
  ) {
    const data = await this.masterFormService.getMasterFormData(
      masterformDto,
      userPayload,
    );
    return { messag: 'Master Form Data', result: data };
  }
}
