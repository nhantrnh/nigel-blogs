import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        JwtModule.registerAsync({
            useFactory: (configService: ConfigService) => ({
                global: true,
                secret: configService.get<string>('SECRET'),
                signOptions: { expiresIn: configService.get<string>('EXP_IN_REFRESH_TOKEN') },
            }),
            inject: [ConfigService],
        }),
        ConfigModule,
    ],
    providers: [AuthService],
    controllers: [AuthController]
})
export class AuthModule {}
