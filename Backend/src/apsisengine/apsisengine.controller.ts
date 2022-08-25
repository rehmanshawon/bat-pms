/**dependencies**/
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
/**services**/
import { ApsisengineService } from './apsisengine.service';
/**guards**/
import { JwtAuthGuard } from './auth/guards';

//swagger doc
@ApiTags('Apsis Engine')
@ApiBearerAuth('jwt')
//apsis engine guards
@UseGuards(JwtAuthGuard)
@Controller({
  //route name
  path: 'apsisengine',
  //api version
  version: '1',
})
export class ApsisengineController {
  constructor(private readonly apsisEngineService: ApsisengineService) {}

  //route
  @Get()
  async testdb() {
    const data = await this.apsisEngineService.testDB();

    return { message: 'success', result: data };
  }
}
