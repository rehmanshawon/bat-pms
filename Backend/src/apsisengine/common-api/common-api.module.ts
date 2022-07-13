import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { jwtConstants } from 'src/apsisengine/auth/constants';
import { CommonApiController } from './common-api.controller';
import { CommonApiService } from './common-api.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
  ],
  controllers: [CommonApiController],
  providers: [CommonApiService],
})
export class commonApiModule {}
