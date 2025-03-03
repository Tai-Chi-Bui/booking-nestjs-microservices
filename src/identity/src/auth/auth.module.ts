import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from '../auth/entities/token.entity';
import { AuthRepository } from '../data/repositories/auth.repository';
import { LoginController, LoginHandler } from './features/v1/login/login';
import { LogoutController, LogoutHandler } from './features/v1/logout/logout';
import {
  RefreshTokenController,
  RefreshTokenHandler
} from './features/v1/refresh-token/refresh-token';
import { GenerateTokenHandler } from './features/v1/generate-token/generate-token';
import { ValidateTokenHandler } from './features/v1/validate-token/validate-token';
import { User } from '../user/entities/user.entity';
import { UserRepository } from '../data/repositories/user.repository';
import { RabbitmqModule } from 'building-blocks/rabbitmq/rabbitmq.module';

@Module({
  imports: [CqrsModule, RabbitmqModule.forRoot(), TypeOrmModule.forFeature([Token, User])],
  controllers: [LoginController, LogoutController, RefreshTokenController],
  providers: [
    LoginHandler,
    GenerateTokenHandler,
    LogoutHandler,
    RefreshTokenHandler,
    ValidateTokenHandler,
    {
      provide: 'IAuthRepository',
      useClass: AuthRepository
    },
    {
      provide: 'IUserRepository',
      useClass: UserRepository
    }
  ],
  exports: []
})
export class AuthModule {}
