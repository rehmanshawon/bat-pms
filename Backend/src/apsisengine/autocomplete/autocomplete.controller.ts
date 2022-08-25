/**dependencies**/
import { Controller, Body, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
/**guards**/
import { JwtAuthGuard } from '../auth/guards';
import { JwtPayloadInterface } from '../auth/interfaces';
import { UserPayload } from '../utils/decorator';
/**service**/
import { AutocompleteService } from './index';
/**dto**/
import { AutocompleteDto } from './dto';
@ApiTags('Autocomplete')
@Controller({
  path: 'autocomplete',
  version: '1',
})
export class AutocompleteController {
  constructor(private readonly autocompleteService: AutocompleteService) {}
  //dropdown
  //swagger doc
  @ApiBearerAuth('jwt')
  //guards
  @UseGuards(JwtAuthGuard)
  //route name
  @Post('autocompletedata')
  async getDropDown(
    @Body() autocompleteDto: AutocompleteDto,
    @UserPayload() userPayload: JwtPayloadInterface,
  ) {
    const data = await this.autocompleteService.getAutocompleteData(
      autocompleteDto,
      userPayload,
    );
    return { messag: 'Autocomplete Data', result: data };
  }
}
