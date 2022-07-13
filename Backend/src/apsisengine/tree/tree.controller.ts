/**dependencies */
import { Controller, Body, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
/**guards**/
import { JwtAuthGuard } from '../auth/guards';
/**service**/
import { TreeService } from './index';
/**dto**/
import { TreeDto } from './dto';

@ApiTags('Tree')
@Controller({
  path: 'tree',
  version: '1',
})
export class TreeController {
  constructor(private readonly treeService: TreeService) {}
  //tree
  //swagger doc
  @ApiBearerAuth('jwt')
  //guards
  @UseGuards(JwtAuthGuard)
  //route name
  @Post('treedata')
  async getDropDown(@Body() treeDto: TreeDto) {
    const data = await this.treeService.getTreeData(treeDto);
    return { messag: 'Tree Data', result: data };
  }
}
