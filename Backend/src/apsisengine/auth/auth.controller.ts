/**dependencies */
import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
/**dto validations */
import {
  ChangePasswordDto,
  ForgotPasswordQueryDto,
  LocalLoginAuthDto,
  LocalLogoutDto,
  RefreshTokenDto,
  RegisterLocalDto,
} from './dto';

/**custom decorators */
import { AuthId } from 'src/apsisengine/utils/decorator';
/**services */
import { AuthService } from './auth.service';
/**guard imports */
import { JwtAuthGuard, JwtRefreshGuard } from './guards';
/**interfaces */
import { JwtPayloadInterface } from './interfaces';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ForgotPasswordSaveDto } from './dto/forgot-password-save.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('Authentication')
@Controller({
  //route path
  path: 'auth',
  //api version
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //user login
  //swagger doc
  @ApiBody({ type: LocalLoginAuthDto })
  @ApiOperation({ summary: 'user authentication' })
  //guard
  @UseGuards(LocalAuthGuard)
  //route name
  @Post('login')
  async localLogin(@Body() localLoginAuthDto: LocalLoginAuthDto) {
    const data = await this.authService.localLogin(localLoginAuthDto);

    return { messag: 'Successfully Logged In.', result: data };
  }
  // get system settings
  @Get('systems')
  async getSystemDAta() {
    const data = await this.authService.getSystemData();

    return { messag: 'Successfully get data', result: data };
  }
  //register a local user
  //swagger doc
  @ApiBearerAuth('jwt')
  @ApiBody({ type: RegisterLocalDto })
  @ApiOperation({ summary: 'user registration' })
  //guards
  @UseGuards(JwtAuthGuard)
  //route name
  @Post('register')
  async registerLocal(@Body() registerLocalDto: RegisterLocalDto) {
    const data = await this.authService.localRegister(registerLocalDto);

    return { message: 'User Created Successfully.', result: data };
  }

  //get access token by refresh token
  //swagger doc
  @ApiBearerAuth('jwt')
  @ApiBody({ type: RefreshTokenDto })
  @ApiOperation({
    summary: 'get access token by refresh token for logged in user',
  })
  //guards
  @UseGuards(JwtRefreshGuard)
  @Post('refreshtoken')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto, @Request() req) {
    const payload_user: JwtPayloadInterface = req.user;
    const refresh_data = await this.authService.refreshTokenData(
      refreshTokenDto,
      payload_user,
      req,
    );

    return { message: 'Successfull', result: refresh_data };
  }

  //change password
  //swagger doc
  @ApiBearerAuth('jwt')
  @ApiBody({ type: ChangePasswordDto })
  @ApiOperation({
    summary: 'save changed password',
  })
  //guards
  @UseGuards(JwtAuthGuard)
  //route name
  @Patch('changepassword')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @AuthId() user_id: number,
  ) {
    const data = await this.authService.changePasswordData(
      user_id,
      changePasswordDto,
    );
    return { message: 'successfull', result: data };
  }
  //get forgot password page data
  //swagger doc
  @ApiBearerAuth('jwt')
  @ApiOperation({
    summary: 'get password logic data ',
  })
  //guards
  @UseGuards(JwtAuthGuard)
  //route name
  @Get('changepassword')
  async getChangePassword(@AuthId() user_id: number) {
    const data = await this.authService.getChangePasswordData(user_id);
    return { message: 'successfull', result: data };
  }
  //swagger doc
  @ApiBearerAuth('jwt')
  @ApiOperation({
    summary: 'loggedin user profile ',
  })
  //guards
  @UseGuards(JwtAuthGuard)
  //route name
  @Get('profile')
  async getUserProfile(@AuthId() user_id: number) {
    const data = await this.authService.getUserProfile(user_id);
    return { message: 'successfull', result: data };
  }

  //send forgot password email
  //swagger doc
  @ApiOperation({
    summary: 'send forgot password request ',
  })
  //route name
  @Post('forgotpassword')
  async sendForgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    const data = await this.authService.sendForgotPassData(forgotPasswordDto);

    return { message: 'success', result: data };
  }

  //get forgot password
  // no authentication needed for this
  //route name
  @ApiQuery({
    name: 'reset_token',
    type: ForgotPasswordQueryDto,
    required: true,
  })
  @ApiOperation({
    summary: 'get forgot password data ',
  })
  @Get('forgotpassword')
  async getForgotPassword(@Query() { reset_token }: ForgotPasswordQueryDto) {
    const data = await this.authService.getForgotPassData(reset_token);

    return { message: 'successfull', result: data };
  }

  //save forget password data
  //swagger doc
  @ApiBearerAuth('jwt')
  @ApiOperation({
    summary: 'save forgot password data ',
  })
  //guards
  @UseGuards(JwtAuthGuard)
  @Patch('forgotpassword')
  async saveForgotPass(@Body() forgotPasswordSaveDto: ForgotPasswordSaveDto) {
    const data = await this.authService.saveForgotPassData(
      forgotPasswordSaveDto,
    );

    return { message: 'successfull', result: data };
  }
  //logut user from the system
  //swagger doc
  @ApiBearerAuth('jwt')
  @ApiOperation({
    summary: 'user logout',
  })
  //guards
  @UseGuards(JwtAuthGuard)
  //route name
  @Post('logout')
  async localLogout(@Req() req, @AuthId() user_id: number) {
    const token = req.headers.authorization.split(' ')[1];
    const data = await this.authService.localLogout(token, user_id);

    return { message: 'successfull', result: data };
  }

  //force logout for multi login not allowed
  @ApiOperation({
    summary: 'forcefully logout user',
    description:
      'this route is for forcefully logout user from all the other devices in case multi login is provoked',
  })
  @Post('force-logout')
  async forceLogout(@Body() localLoginAuthDto: LocalLoginAuthDto) {
    const reset_data = await this.authService.forceLogout(localLoginAuthDto);

    return { message: 'success', result: reset_data };
  }
}
