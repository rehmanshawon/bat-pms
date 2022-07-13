/**dependencies */
import { Body, Controller, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

/**services */
import { AttachmentService } from './attachment.service';
/**guards */
import { JwtAuthGuard } from '../auth/guards';
/**decorators */
import { ApiFiles, CompanyId, UserPayload } from '../utils/decorator';
/**validation dto */
import {
  AttachConfigDto,
  AttachmentDeleteFilesDto,
  AttachmentListDto,
  UploadAttacmenthDto,
} from './dto';
/**custom file validation interceptor */
import { JwtPayloadInterface } from '../auth/interfaces';

//swagger doc
@ApiTags('attachment')
@ApiBearerAuth('jwt')
//auth guard
@UseGuards(JwtAuthGuard)
@Controller({
  //route name
  path: 'attachment',
  //api version
  version: '1',
})
export class AttachmentController {
  constructor(private readonly attachmentService: AttachmentService) {}

  //get attachement configurations
  @ApiOperation({ summary: 'get attachment configuration data' })
  @Post('config')
  async getAttachmentConfig(
    @Body() attachConfigDto: AttachConfigDto,
    @CompanyId() company_id: number,
  ) {
    const attachConfData = await this.attachmentService.getAttachConfData(
      attachConfigDto,
      company_id,
    );

    return { message: 'successfull', result: attachConfData };
  }

  //upload files
  @ApiOperation({ summary: 'upload multiple files for application' })
  @ApiFiles()
  @Post('upload')
  async uploadFile(
    @Body() data: UploadAttacmenthDto,
    @UserPayload() user_data: JwtPayloadInterface,
  ) {
    //save attach_log
    const saveAttachLog = await this.attachmentService.uploadAttachData(
      data,
      user_data,
    );

    return { message: 'success', result: saveAttachLog };
  }

  //get supported doc list
  @ApiOperation({ summary: 'supported documnet file list' })
  @Post('uploaded-files')
  async getUploadedFiles(@Body() data: AttachmentListDto) {
    const attachLogDataList = await this.attachmentService.getUploadedFilesData(
      data,
    );

    return { message: 'successfull', result: attachLogDataList };
  }
  //delete a file from database
  @ApiOperation({ summary: 'delete file' })
  @Patch('delete-files')
  async deleteAttach(
    @Body() data: AttachmentDeleteFilesDto,
    @UserPayload() user_data: JwtPayloadInterface,
  ) {
    const attachVerifyUpdate =
      await this.attachmentService.verifyAndUpdateAttach(data, user_data);
    return { message: 'successfull', result: attachVerifyUpdate };
  }
}
