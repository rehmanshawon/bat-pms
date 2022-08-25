import { Controller, Post, Body, UseGuards, Get, Param } from '@nestjs/common';
import { CommonApiService } from './common-api.service';
import { CommonApiDto } from './dto/common-api.dto';
import { UserPayload } from 'src/apsisengine/utils/decorator';
import { JwtPayloadInterface } from 'src/apsisengine/auth/interfaces';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/apsisengine/auth/guards';

@ApiTags('vendor')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
@Controller({
  path: 'common-api',
  version: '1',
})
export class CommonApiController {
  constructor(private readonly commonApiService: CommonApiService) {}
  @ApiOperation({
    summary: 'create a new vendor',
    description:
      'this vendor api is responsible for creating a vendor by post request. to make post request check json format properly',
  })
  @Post('/approved-check')
  async create(
    @Body() createvendordto: CommonApiDto,
    @UserPayload() userPayload: JwtPayloadInterface,
  ) {
    const data = await this.commonApiService.create(
      createvendordto,
      userPayload,
    );
    return { result: data };
  }

  @Get('/encrypt/:id')
  async getEncrypt(
    @UserPayload() userPayload: JwtPayloadInterface,
    @Param('id') id: number,
  ) {
    const data = await this.commonApiService.getEncrypt(userPayload, id);
    return { result: data };
  }

  @Get('/decrypt/:id')
  async getDecrypt(@UserPayload() userPayload: JwtPayloadInterface) {
    const data = await this.commonApiService.getDecrypt(userPayload);
    return { result: data };
  }
}
