/**dependencies */
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

/**guards**/
import { JwtAuthGuard } from 'src/apsisengine/auth/guards';

/**Helper function**/
import MessageHelper from 'src/apsisengine/common/helpers/messageHelper';

@ApiTags('Alert Message')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
@Controller({
  path: 'alertmessage',
  version: '1',
})
export class MessageController {
  constructor(private readonly messageHelper: MessageHelper) {}
  @ApiOperation({
    summary: 'Alert Message',
    description:
      'this message api is responsible for sending dynamic Alert message by post request',
  })
  @Post()
  async create(
    @Body('module_name') module_name: string,
    @Body('message_code') message_code: string,
    @Body('external_data') external_data: any,
  ) {
    const data = await this.messageHelper.lang(
      module_name,
      message_code,
      external_data,
    );
    return { result: data };
  }
}
