/* dependencies */
import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as randtoken from 'rand-token';
import { DateTime } from 'luxon';

/**db imports */
import { KnexErrorService } from 'src/apsisengine/common/knexerrors';
import { KNEX_CONNECTION } from 'src/knexmodule';
/**dto validations */
import {
  ChangePasswordDto,
  LocalLoginAuthDto,
  LocalLogoutDto,
  RefreshTokenDto,
} from './dto';
import { RegisterLocalDto } from './dto/register-local.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ForgotPasswordSaveDto } from './dto/forgot-password-save.dto';
/**interfaces */
import { JwtPayloadInterface, RefreshToken } from './interfaces';
/**cache services */
import { RedisCacheService } from '../cache';
/**helpers */
import Helpers from '../common/helpers/apsisHelper';
/**app configs */
import { EngineConfigService } from '../config/engineconfig';
/** external services */
import { LoggerActivityService } from '../logger-activity/logger-activity.service';
import { AuditTrailService } from '../audit-trail/audit-trail.service';
import { SessionFilterService } from '../session-filter/session-filter.oracle.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(KNEX_CONNECTION) private readonly knex,
    private jwtService: JwtService,
    private readonly knexErrorService: KnexErrorService,
    private readonly redisCacheService: RedisCacheService,
    private readonly engineConfigService: EngineConfigService,
    private readonly loggerActivityService: LoggerActivityService,
    private readonly auditTrailService: AuditTrailService,
    private readonly sessionFilterService: SessionFilterService,
  ) {}

  //local login
  async localLogin(localLoginAuthDto: LocalLoginAuthDto) {
    const user = await this.knex('sys_users')
      .select(
        'sys_users.user_id',
        'sys_users.user_code',
        'sys_users.is_employee',
        'sys_users.user_name',
        'sys_users.email',
        'sys_users.full_name',
        'sys_users.mobile',
        'sys_users.company_id',
        'sys_users.password',
        'sys_users.date_of_birth',
        'sys_users.verified_at',
        'sys_users.gender',
        'sys_users.user_image',
        'sys_users.password_reset_token',
        'sys_users.password_reset_token_expiry_date',
        'sys_users.branch_id',
        'sys_users.department_id',
        'sys_users.division_id',
        'sys_users.default_module_id',
        'sys_users.is_reliever',
        'sys_users.reliever_to',
        'sys_users.reliever_start_datetime',
        'sys_users.reliever_end_datetime',
        'sys_users.line_manager_id',
        'sys_users.status',
        'sys_users.designation_id',
        'sys_branchs.branch_type',
        this.knex.raw(`listagg("sys_privilege_roles"."role_id",',') as "role"`),
      )
      .leftJoin(
        'sys_branchs',
        'sys_branchs.branch_id',
        '=',
        'sys_users.branch_id',
      )
      .leftJoin(
        'sys_privilege_roles',
        'sys_privilege_roles.user_id',
        '=',
        'sys_users.user_id',
      )
      .where(function () {
        this.where('sys_users.user_name', localLoginAuthDto.user).orWhere(
          'sys_users.email',
          localLoginAuthDto.user,
        );
      })
      .where('sys_users.status', '1')
      .groupBy(
        'sys_users.user_id',
        'sys_users.user_code',
        'sys_users.is_employee',
        'sys_users.user_name',
        'sys_users.email',
        'sys_users.full_name',
        'sys_users.mobile',
        'sys_users.company_id',
        'sys_users.password',
        'sys_users.date_of_birth',
        'sys_users.verified_at',
        'sys_users.gender',
        'sys_users.user_image',
        'sys_users.password_reset_token',
        'sys_users.password_reset_token_expiry_date',
        'sys_users.branch_id',
        'sys_users.department_id',
        'sys_users.division_id',
        'sys_users.default_module_id',
        'sys_users.is_reliever',
        'sys_users.reliever_to',
        'sys_users.reliever_start_datetime',
        'sys_users.reliever_end_datetime',
        'sys_users.line_manager_id',
        'sys_users.status',
        'sys_users.designation_id',
        'sys_branchs.branch_type',
      )
      .first()
      .catch((error: { message: string }) =>
        this.knexErrorService.errorMessage(error.message),
      );

    if (!user) {
      throw new NotFoundException('Invalid Username Or Password!');
    }

    if (
      !user ||
      !(await bcrypt.compare(localLoginAuthDto.password, user.password))
    ) {
      throw new NotFoundException('Invalid Username Or Password!');
    }

    delete user.password;

    //get last generated access and refresh token for logged user
    const token_data = await this.knex('sys_user_tokens')
      .where('user_id', user.user_id)
      .where('status', 1)
      .orderBy('user_token_id', 'desc')
      .first()
      .catch((error) => this.knexErrorService.errorMessage(error.message));
    if (!token_data) {
      throw new NotFoundException('Token data not found');
    }
    //set token data
    user.access_token = token_data.access_token;
    user.refresh_token = token_data.refresh_token;

    return user;
  }

  //create a local user
  async localRegister(registerLocalDto: RegisterLocalDto) {
    const checkUniqueUser = await this.knex('sys_users')
      .where(function () {
        this.where('user_name', registerLocalDto.user_name).orWhere(
          'email',
          registerLocalDto.email,
        );
      })
      .first()
      .catch((error) => this.knexErrorService.errorMessage(error.message));

    if (checkUniqueUser) {
      const message = { user_name: [], email: [] };

      //validations messages for check users
      if (
        checkUniqueUser.user_name === registerLocalDto.user_name &&
        checkUniqueUser.email === registerLocalDto.email
      ) {
        message.user_name.push('User name already exists!');
        message.email.push('Email already exists!');
      } else if (checkUniqueUser.user_name === registerLocalDto.user_name) {
        message.user_name.push('User name already exists!');
      } else if (checkUniqueUser.email === registerLocalDto.email) {
        message.email.push('Email already exists!');
      } else {
        message.user_name.push('User name already exists!');
        message.email.push('Email already exists!');
      }
      throw new ForbiddenException(message);
    }

    //default password creation
    if (!registerLocalDto.password) {
      registerLocalDto.password = '123456';
    }
    //create hashed password
    const hashedPass = await this.hashPassword(registerLocalDto.password); // Here 4 is salt

    const newUser = await this.knex('sys_users').insert({
      user_name: registerLocalDto.user_name,
      password: hashedPass,
      email: registerLocalDto.email,
      user_code: registerLocalDto.user_code,
      full_name: registerLocalDto.full_name,
      company_id: registerLocalDto.company_id,
      branch_id: registerLocalDto.branch_id,
      created_at: new Date(),
      status: '1',
    });

    return newUser;
  }
  //validate user for jwt strategy
  async validateJwtStrtegyUser(payload: JwtPayloadInterface) {
    const user = await this.knex('sys_users')
      .where('user_id', payload.user_id)
      .where('status', '1')
      .first()
      .catch((error) => this.knexErrorService.errorMessage(error.message));

    if (!user) {
      throw new UnauthorizedException('Unauthorized access!');
    }

    return user;
  }
  //create jwt access token
  async signUser(user: any, type: string) {
    const parent_branch = await this.knex('sys_branchs')
      .select('parent_branch_id')
      .where({ branch_id: user.branch_id })
      .first()
      .catch((error) => this.knexErrorService.errorMessage(error.message));

    const data: JwtPayloadInterface = {
      user_id: user.user_id,
      user_name: user.user_name,
      company_id: user.company_id,
      branch_id: user.branch_id,
      branch_type: user.branch_type,
      department_id: user.department_id,
      division_id: user.division_id,
      email: user.email,
      type: type,
      parent_branch_id: parent_branch.parent_branch_id,
    };

    //set redis data
    await this.setSessionAccessKeys(data);
    //find redis key and destroy or set

    const signJwt = this.jwtService.sign(data);
    return signJwt;
  }

  //set redis access and group key
  async setSessionAccessKeys(data: JwtPayloadInterface) {
    //set user data
    const userAccess = await this.sessionFilterService.setUserFilterArray(data);
    const groupAccess =
      await this.sessionFilterService.setPermissionFilterArray(data);

    const userAccessKey = 'USER_ACCESS_' + data.user_id;
    const groupAccessKey = 'GROUP_ACCESS_' + data.user_id;

    //destroy redis keys
    await this.redisCacheService.delete(userAccessKey);
    await this.redisCacheService.delete(groupAccessKey);

    //set redis data
    await this.redisCacheService.set(userAccessKey, JSON.stringify(userAccess));
    await this.redisCacheService.set(
      groupAccessKey,
      JSON.stringify(groupAccess),
    );
  }

  //generate refresh token
  async generateRefreshToken(): Promise<string> {
    const refreshToken = randtoken.generate(16);
    const expirydate = new Date();
    expirydate.setDate(expirydate.getDate() + 6);
    return refreshToken;
  }

  //save or update refresh token
  async saveorupdateRefreshToken(
    refreshToken: string,
    userId: number,
    expirydate: Date,
  ) {
    await this.knex('sys_users')
      .where({ user_id: userId })
      .update({
        refresh_token: refreshToken,
        refresh_token_expiry_date: expirydate,
      })
      .catch((error) => this.knexErrorService.errorMessage(error.message));
  }

  //validate refresh token strategy
  async validateRefreshToken(
    refresh_token: string,
    payload: JwtPayloadInterface,
  ) {
    const verifiy_refresh_token = await this.knex('sys_user_tokens')
      .where('user_id', payload.user_id)
      .where('company_id', payload.company_id)
      .where('refresh_token', refresh_token)
      .where('status', 1)
      .first()
      .catch((error) => this.knexErrorService.errorMessage(error.message));

    if (!verifiy_refresh_token) {
      throw new NotFoundException('Token mismatch!');
    }

    if (refresh_token != (await verifiy_refresh_token).refresh_token) {
      throw new NotFoundException('Token mismatch!');
    }

    if (
      new Date() >
      new Date((await verifiy_refresh_token).refresh_token_expiry_date)
    ) {
      throw new ForbiddenException('Refresh token expired.Please Login.');
    }

    return verifiy_refresh_token;
  }

  //validate refresh token
  async refreshTokenData(
    refreshTokenDto: RefreshTokenDto,
    user: JwtPayloadInterface,
    req,
  ) {
    const data: RefreshToken = {
      access_token: '',
      refresh_token: '',
    };
    const verify_token_data = await this.knex('sys_user_tokens')
      .where('company_id', user.company_id)
      .where('user_id', user.user_id)
      .where('refresh_token', refreshTokenDto.refresh_token)
      .where('status', 1)
      .first()
      .catch((error) => this.knexErrorService.errorMessage(error.message));

    //if refresh token expires
    if (
      DateTime.now().toUTC().toISO() >
        DateTime.fromJSDate(verify_token_data.refresh_token_expiry_date)
          .toUTC()
          .toISO() ===
      true
    ) {
      await this.knex('sys_user_tokens')
        .where('refresh_token', refreshTokenDto.refresh_token)
        .update({
          status: 0,
        })
        .catch((error) => this.knexErrorService.errorMessage(error.message));
      throw new UnauthorizedException('Token expired.Please logout!');
    }
    //update token data and set to inactive status
    await this.knex('sys_user_tokens')
      .where('company_id', user.company_id)
      .where('user_id', user.user_id)
      .where('refresh_token', refreshTokenDto.refresh_token)
      .update({
        status: 0,
      })
      .catch((error) => this.knexErrorService.errorMessage(error.message));
    //get new token data
    data.access_token = await this.signUser(user, user.type);
    data.refresh_token = await this.generateRefreshToken();

    const expirydate = new Date();
    expirydate.setDate(expirydate.getDate() + 6);
    //insert new data into user token table
    await this.knex('sys_user_tokens').insert({
      company_id: user.company_id,
      user_id: user.user_id,
      refresh_token: data.refresh_token,
      refresh_token_expiry_date: expirydate,
      access_token: data.access_token,
      ip_address: req.ip,
    });

    return data;
  }
  //change password data
  async changePasswordData(user_id: number, data: ChangePasswordDto) {
    const user = await this.knex('sys_users')
      .where('user_id', user_id)
      .where('status', '1')
      .first()
      .catch((error) => this.knexErrorService.errorMessage(error.message));

    if (!user) {
      throw new NotFoundException('No data found!');
    }
    const message = { new_password: [], password_reset_token: [] };
    //check for password reset token
    if (data.password_reset_token !== user.password_reset_token) {
      message.password_reset_token.push('Unauthorized!Token Mismatch.');
      delete message.new_password;
      throw new ForbiddenException(message);
    }

    //check for password conf info
    const userRolePassData = await this.userRolePassInfo(user.user_id);
    //check for the regex data
    if (!data.new_password.match(userRolePassData.password_regex)) {
      message.new_password.push(userRolePassData.password_regex_error_msg);
      delete message.password_reset_token;
      throw new NotFoundException(message);
    }
    //old password not match
    if (!(await bcrypt.compare(data.old_password, user.password))) {
      throw new ForbiddenException('Old password does not match record.');
    }
    //check for confirm pass
    if (data.new_password !== data.confirm_new_password) {
      throw new ForbiddenException('New and confirm password not matched!');
    }
    const hashedPassword = await this.hashPassword(data.new_password);

    //update user with new password
    const updatePassword = await this.knex('sys_users')
      .where('user_id', user_id)
      .update({ password: hashedPassword })
      .catch((error) => this.knexErrorService.errorMessage(error.message));

    if (!updatePassword) {
      throw new ForbiddenException('could not update data!');
    }

    const passResetTokenUpdate = this.updatePasswordResetToken(user_id);

    if (!passResetTokenUpdate) {
      throw new ForbiddenException('Password Reset Token Update Failed!');
    }

    return updatePassword;
  }
  //get hashed password
  async hashPassword(password: string) {
    const hashed_pass = await bcrypt.hashSync(password, 4); // 4 is the salt here

    return hashed_pass;
  }
  //get user level password info by id
  async userRolePassInfo(user_id: number) {
    const user_role = await this.knex('sys_roles')
      .select('sys_roles.*')
      .join('sys_privilege_roles', function () {
        this.on('sys_roles.role_id', '=', 'sys_privilege_roles.role_id').andOn(
          'sys_roles.company_id',
          '=',
          'sys_privilege_roles.company_id',
        );
      })
      .join('sys_users', function () {
        this.on('sys_privilege_roles.user_id', '=', 'sys_users.user_id');
        this.andOn(
          'sys_privilege_roles.company_id',
          '=',
          'sys_users.company_id',
        );
      })
      .where('sys_users.user_id', user_id)
      .orderBy('sys_roles.role_id', 'ASC')
      .where('sys_roles.status', '1')
      .first()
      .catch((error) => this.knexErrorService.errorMessage(error.message));

    if (!user_role) {
      throw new NotFoundException('No user role data configured.');
    }

    return user_role;
  }

  //get password reset page data
  async getChangePasswordData(user_id: number) {
    const userRolePassData: any = await this.userRolePassInfo(user_id);

    const randToken = randtoken.generate(20);
    userRolePassData.password_reset_token = randToken;
    //update reset token into database
    const updateData = await this.updatePasswordResetToken(user_id, randToken);

    if (!updateData) {
      throw new NotFoundException('Password Token Update Failed!');
    }

    return userRolePassData;
  }
  //update rand password reset token
  async updatePasswordResetToken(
    user_id: number,
    randToken = null,
    token_expiry_datetime = null,
  ) {
    return await this.knex('sys_users')
      .where('user_id', user_id)
      .update({
        password_reset_token: randToken,
        password_reset_token_expiry_date: token_expiry_datetime
          ? token_expiry_datetime
          : null,
      })
      .catch((error) => this.knexErrorService.errorMessage(error.message));
  }

  //get user profile information
  async getUserProfile(user_id: number) {
    const user_data = await this.knex('sys_users')
      .select(
        'sys_users.user_id',
        'sys_users.user_code',
        'sys_users.user_name',
        'sys_users.email',
        'sys_users.full_name',
        'sys_users.mobile',
        'sys_users.date_of_birth',
        'sys_users.gender',
        'sys_users.user_image',
        'sys_companys.company_code',
        'sys_companys.company_name',
        'sys_companys.company_short_code',
        'sys_users.department_id',
        'sys_departments.department_code',
        'sys_departments.department_name',
        'sys_departments.department_short_code',
        'sys_branchs.branch_code',
        'sys_branchs.branch_name',
        'sys_branchs.branch_short_code',
        'sys_users.division_id',
        'sys_users.branch_id',
        'sys_divisions.division_code',
        'sys_divisions.division_name',
        'sys_divisions.division_short_code',
      )
      .leftJoin(
        'sys_companys',
        'sys_users.company_id',
        'sys_companys.company_id',
      )
      .leftJoin('sys_departments', function () {
        this.on('sys_users.company_id ', '=', 'sys_departments.company_id');
        this.andOn(
          'sys_users.department_id',
          '=',
          'sys_departments.department_id',
        );
      })
      .leftJoin('sys_branchs', function () {
        this.on('sys_users.branch_id', '=', 'sys_branchs.branch_id');
        this.andOn('sys_users.company_id', '=', 'sys_branchs.company_id');
      })
      .leftJoin('sys_divisions', function () {
        this.on('sys_users.division_id', '=', 'sys_divisions.division_id');
        this.andOn('sys_users.company_id', '=', 'sys_divisions.company_id');
      })
      .where('sys_users.user_id', user_id)
      .where('sys_users.status', 1)
      .first()
      .catch((error) => this.knexErrorService.errorMessage(error.message));

    if (!user_data) {
      throw new NotFoundException('No user data found!');
    }

    return user_data;
  }
  //send email for forgot pass data
  async sendForgotPassData(forgotPasswordDto: ForgotPasswordDto) {
    const user_data = await this.verifyByUserEmail(
      forgotPasswordDto.user_email,
    );
    if (!user_data) {
      throw new NotFoundException('Email not found!');
    }
    const randToken: string = randtoken.generate(20);
    //set the password reset token expiry date
    //get the expiry hour from company config
    const pass_reset_expiry_hour: number =
      await this.engineConfigService.lookupKey(
        'pass_reset_expiry_hour',
        user_data.company_id,
      );

    //add expiry hours into the date time
    const password_reset_expiry_datetime = Helpers.addHoursToDateTime(
      pass_reset_expiry_hour,
    );
    //section for sending email to users

    //update reset token into database
    const updateData = await this.updatePasswordResetToken(
      user_data.user_id,
      randToken,
      password_reset_expiry_datetime,
    );

    if (!updateData) {
      throw new NotFoundException('Password Token Update Failed!');
    }

    return randToken;
  }
  //get forgot password data
  async getForgotPassData(password_reset_token: string) {
    //get user id by pass reset token
    const user_data = await this.knex('sys_users')
      .where('password_reset_token', password_reset_token)
      .first()
      .catch((error) => this.knexErrorService.errorMessage(error.message));
    //if token is not there
    if (!user_data) {
      throw new ForbiddenException('Token not matched!');
    }
    //if the password reset token expired
    if (
      DateTime.now().toUTC().toISO() >
        DateTime.fromJSDate(user_data.password_reset_token_expiry_date)
          .toUTC()
          .toISO() ===
      true
    ) {
      const update_pass_token = await this.updatePasswordResetToken(
        user_data.user_id,
      );

      if (!update_pass_token) {
        throw new ForbiddenException('Password reset token update failed!');
      }
      throw new ForbiddenException('Token expired.Please request new token!');
    }

    const userRolePassData: any = await this.userRolePassInfo(
      user_data.user_id,
    );

    if (!userRolePassData) {
      throw new NotFoundException('No role password config nound');
    }

    return userRolePassData;
  }
  //save forgot password data
  async saveForgotPassData(forgotPasswordSaveDto: ForgotPasswordSaveDto) {
    const user = await this.knex('sys_users')
      .where('password_reset_token', forgotPasswordSaveDto.password_reset_token)
      .first()
      .catch((error) => this.knexErrorService.errorMessage(error.message));

    if (!user) {
      throw new ForbiddenException('Token not matched!');
    }

    const message = { new_password: [], password_reset_token: [] };
    //check for password reset token
    if (
      forgotPasswordSaveDto.password_reset_token !== user.password_reset_token
    ) {
      message.password_reset_token.push('Unauthorized!Token Mismatch.');
      delete message.new_password;
      throw new ForbiddenException(message);
    }

    //if the password reset token
    if (
      DateTime.now().toUTC().toISO() >
        DateTime.fromJSDate(user.password_reset_token_expiry_date)
          .toUTC()
          .toISO() ===
      true
    ) {
      const update_pass_token = await this.updatePasswordResetToken(
        user.user_id,
      );

      if (!update_pass_token) {
        throw new ForbiddenException('Password reset token update failed!');
      }
      throw new ForbiddenException('Token expired.Please request new token!');
    }

    //check for password conf info
    const userRolePassData = await this.userRolePassInfo(user.user_id);
    //check for the regex data
    if (
      !forgotPasswordSaveDto.new_password.match(userRolePassData.password_regex)
    ) {
      message.new_password.push(userRolePassData.password_regex_error_msg);
      delete message.password_reset_token;
      throw new NotFoundException(message);
    }
    //check for confirm pass
    if (
      forgotPasswordSaveDto.new_password !==
      forgotPasswordSaveDto.confirm_new_password
    ) {
      throw new ForbiddenException('New and confirm password not matched!');
    }
    const hashedPassword = await this.hashPassword(
      forgotPasswordSaveDto.new_password,
    );

    //update user with new password
    const updatePassword = await this.knex('sys_users')
      .where('user_id', user.user_id)
      .update({ password: hashedPassword })
      .catch((error) => this.knexErrorService.errorMessage(error.message));

    if (!updatePassword) {
      throw new ForbiddenException('Could not update password data!');
    }

    const passResetTokenUpdate = this.updatePasswordResetToken(user.user_id);

    if (!passResetTokenUpdate) {
      throw new ForbiddenException('Password Reset Token Update Failed!');
    }

    return updatePassword;
  }
  //veirfy user by email
  async verifyByUserEmail(user_email: string) {
    const data = await this.knex('sys_users')
      .where('email', user_email)
      .first()
      .catch((error) => this.knexErrorService.errorMessage(error.message));

    if (!data) {
      throw new NotFoundException('Email not found!');
    }

    return data;
  }
  //logout user from system
  async localLogout(token: string, user_id: number) {
    if (!user_id) {
      throw new BadRequestException();
    }

    const token_data = await this.knex('sys_user_tokens')
      .where({
        user_id: user_id,
        status: 1,
        access_token: token,
      })
      .first()
      .catch((error) => this.knexErrorService.errorMessage(error.message));

    const user_data = await this.knex('sys_user_tokens')
      .where({
        user_id: user_id,
        status: 1,
        refresh_token: token_data.refresh_token,
      })
      .update({
        status: 0,
      })
      .catch((error) => this.knexErrorService.errorMessage(error.message));

    if (!user_data) {
      throw new NotFoundException('No user data found!');
    }

    //logger activity change
    await this.knex('sys_logger_activitys')
      .where({
        user_id: user_id,
        refresh_token: token_data.refresh_token,
      })
      .update({
        wrong_login_status: 0,
        log_out_time: Helpers.mysql_datetime(),
        log_out_type: 'Normal',
      })
      .catch((error) => this.knexErrorService.errorMessage(error.message));

    return 'Successfully loged out!';
  }
  //local guard strategy validation
  async validateLocalUser(req, user: string, password: string) {
    const logger_data: any = {};
    const user_data: any = await this.knex('sys_users')
      .select('sys_users.*', 'sys_branchs.branch_type')
      .leftJoin(
        'sys_branchs',
        'sys_branchs.branch_id',
        '=',
        'sys_users.branch_id',
      )
      .where(function () {
        this.where('sys_users.user_name', user).orWhere(
          'sys_users.email',
          user,
        );
      })
      .where('sys_users.status', '1')
      .first()
      .catch((error: { message: string }) =>
        this.knexErrorService.errorMessage(error.message),
      );
    //console.log(user_data);
    //check for wrong login attempt count
    //get wrong login counts
    if (user_data !== undefined) {
      await this.wrongLoginAttempt(user_data, req.ip);
    }

    //logger activitys data
    logger_data.logger_event = 'Failed Login';
    logger_data.company_id = null;
    logger_data.user_id = null;
    logger_data.user_type = 'Guest';
    logger_data.route =
      req.protocol + '://' + req.get('host') + req.originalUrl;
    logger_data.ip_address = req.ip;
    logger_data.user_agent = req.get('user-agent');
    logger_data.method_type = req.method;

    if (!user_data) {
      logger_data.wrong_login_status = 1;
      logger_data.description = 'Username/email not found!';

      //insert into log data
      await this.loggerActivityService.logActivities(logger_data);
      throw new NotFoundException('Invalid Username Or Password!');
    }

    //match pasword data
    if (!user_data || !(await bcrypt.compare(password, user_data.password))) {
      logger_data.description = 'password mismatch';
      logger_data.company_id = user_data.company_id;
      logger_data.user_id = user_data.user_id;
      logger_data.user_type = 'Registered';
      logger_data.wrong_login_status = 1;
      //insert into log data
      await this.loggerActivityService.logActivities(logger_data);

      throw new NotFoundException('Invalid Username Or Password!');
    }

    delete user_data.password;

    //set user ip
    user_data.ip = req.ip;

    //process token_data
    const token_data = await this.saveUpdatetokenData(user_data);

    logger_data.logger_event = 'Logged In';
    logger_data.description = 'Logged In';
    logger_data.company_id = user_data.company_id;
    logger_data.user_id = user_data.user_id;
    logger_data.user_type = 'Registered';
    logger_data.access_token = token_data.access_token;
    logger_data.refresh_token = token_data.refresh_token;

    //insert into log data
    await this.loggerActivityService.logActivities(logger_data);

    //reset logger activity data after successfull login
    await this.knex('sys_logger_activitys')
      .where('wrong_login_status', 1)
      .where((builder) => {
        builder.where('user_id', user_data.user_id);
        builder.orWhere('ip_address', req.ip);
      })
      .update({
        wrong_login_status: 0,
      })
      .catch((error) => this.knexErrorService.errorMessage(error.message));

    return user_data;
  }

  //save or update token data
  async saveUpdatetokenData(user_data: any) {
    const multi_login = await this.checkMultiLogin(user_data.user_id);
    //set jwt accestoken data
    const access_token = await this.signUser(user_data, 'user');
    //set refresh token for the user
    const refresh_token = await this.generateRefreshToken();
    //set the expiry date
    const expirydate = new Date();
    expirydate.setDate(expirydate.getDate() + 6);

    //check for multilogin allow/not allowed
    if (multi_login === true) {
      //insert into user_tokens
      const token_data = await this.knex('sys_user_tokens')
        .insert({
          company_id: user_data.company_id,
          user_id: user_data.user_id,
          refresh_token: refresh_token,
          refresh_token_expiry_date: expirydate,
          access_token: access_token,
          ip_address: user_data.ip,
        })
        .catch((error) => this.knexErrorService.errorMessage(error.message));
      //token data insertion fails
      if (!token_data) {
        throw new BadRequestException('Token generation failed.');
      }
    } else {
      //check for token data
      const token_verify = await this.knex('sys_user_tokens')
        .where('user_id', user_data.user_id)
        .where('status', 1)
        .first()
        .catch((error) => this.knexErrorService.errorMessage(error.message));
      //return  token multilogin error
      if (token_verify) {
        throw new ForbiddenException(
          'You are logged in on another device.Do you want to log out?',
        );
      }

      //if no token is available then
      const token_data = await this.knex('sys_user_tokens')
        .insert({
          company_id: user_data.company_id,
          user_id: user_data.user_id,
          refresh_token: refresh_token,
          refresh_token_expiry_date: expirydate,
          access_token: access_token,
          ip_address: user_data.ip,
        })
        .catch((error) => this.knexErrorService.errorMessage(error.message));
      //token data insertion fails
      if (!token_data) {
        throw new BadRequestException('Token generation failed.');
      }
    }

    return { access_token: access_token, refresh_token: refresh_token };
  }
  //check for multilogin
  async checkMultiLogin(user_id: number) {
    const data = await this.userRolePassInfo(user_id);
    if (data.multi_login_allow === 0) {
      return false;
    }

    return true;
  }

  //force logout user fro multi login provoakation
  async forceLogout(localLoginAuthDto: LocalLoginAuthDto) {
    //validate user login
    const user = await this.knex('sys_users')
      .where(function () {
        this.where('user_name', localLoginAuthDto.user).orWhere(
          'email',
          localLoginAuthDto.user,
        );
      })
      .where('status', '1')
      .first()
      .catch((error: { message: string }) =>
        this.knexErrorService.errorMessage(error.message),
      );

    if (!user) {
      throw new NotFoundException('Invalid Username Or Password!');
    }

    if (
      !user ||
      !(await bcrypt.compare(localLoginAuthDto.password, user.password))
    ) {
      throw new NotFoundException('Invalid Username Or Password!');
    }

    //manual user_data from audit trail
    const user_info: any = {};
    user_info.user_id = user.user_id;
    user_info.company_id = user.company_id;

    //set all the active token data of user inactive
    const reset_token = await this.knex('sys_user_tokens')
      .where('user_id', user.user_id)
      .where('company_id', user.company_id)
      .where('status', 1)
      .update({
        status: 0,
      })
      // // for audit trail log
      // .on('query-response', async (response: any, obj: any, builder: any) => {
      //   if (response) {
      //     await this.auditTrailService.update(builder, user_info);
      //   }
      // })
      .catch((error) => this.knexErrorService.errorMessage(error.message));
    if (!reset_token) {
      throw new NotFoundException('No token data found!');
    }

    //reset logger data
    if (reset_token) {
      await this.knex('sys_logger_activitys')
        .where({
          user_id: user.user_id,
          company_id: user.company_id,
        })
        .update({
          log_out_time: Helpers.mysql_datetime(),
          log_out_type: 'Force',
        })
        .catch((error) => this.knexErrorService.errorMessage(error.message));
    }

    return 'logged out from other devices';
  }

  //check for wrong login attempt count
  async wrongLoginAttempt(userData, ip_address) {
    const ip_address_max_wrong_attempt =
      Number(process.env.MAX_WRONG_LOGIN_ATTEMPT) || 5;
    const loggerData = await this.knex('sys_logger_activitys').where(
      function () {
        this.where({ wrong_login_status: 1 });
        if (userData) {
          this.where('user_id', userData.user_id);
          this.where('company_id', userData.company_id);
        } else {
          this.where('ip_address', ip_address);
          this.where('user_type', 'Guest');
        }
      },
    );
    let rolepass: any;
    //get rollpass info
    if (userData) {
      //get user role info
      rolepass = await this.userRolePassInfo(userData.user_id);

      //check for failed login attempt exceeds the max wrong login attempt config
      if (loggerData.length >= rolepass.max_wrong_login_attemp) {
        //if the wrong logint attempt penalty is set to blocked
        if (rolepass.wrong_login_attemp === 'Blocked') {
          throw new ForbiddenException(
            'Account Blocked! Too many failed login attempt.',
          );
        } else if (rolepass.wrong_login_attemp === 'Block for a Period') {
          //add wrong login attempt minutes to the last failed attempt data
          const addedDateMinutes = Helpers.addMinutesToDateTime(
            rolepass.block_period,
            loggerData[loggerData.length - 1].created_at,
          );
          const startDate = DateTime.fromFormat(
            addedDateMinutes,
            'yyyy-MM-dd TT',
          ).toUTC();
          const diff = Math.abs(startDate.diffNow().as('seconds'));
          const wholeNumberedDateDifference = Math.round(diff);
          const block_seconds = rolepass.block_period * 60;
          if (wholeNumberedDateDifference <= block_seconds) {
            throw new HttpException(
              `Too Many wrong attempt! Pease try later after ${wholeNumberedDateDifference} seconds.`,
              HttpStatus.TOO_MANY_REQUESTS,
            );
          }
        }
      }
    }
    //if the user data is not registered user/for guest user
    if (!userData && ip_address) {
      if (loggerData.length >= ip_address_max_wrong_attempt) {
        throw new HttpException(
          `Too Many wrong attempt! Please try later after sometime.`,
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
    }
  }
  //verify jwt service
  verifyJwt(jwt: string) {
    return this.jwtService.verify(jwt);
  }
  async getSystemData() {
    const systemData = await this.knex('sys_configs')
      .where('config_slug', 'company_config')
      .select('config_key', 'config_value')
      .catch((error) => this.knexErrorService.errorMessage(error.message));
    return systemData;
  }
}
