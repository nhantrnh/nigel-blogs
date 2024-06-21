import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        private jwtService: JwtService,
        private configService: ConfigService,
    ){}

    async register(registerUserDto: RegisterUserDto): Promise<User>{
        const hashPassword = await this.hashPassword(registerUserDto.password);
        return await this.userRepository.save({...registerUserDto, password: hashPassword, refreshToken: "huhu"});
    }

    async login(loginUserDto: LoginUserDto): Promise<any>{
        const user = await this.userRepository.findOne(
            {
                where: {email: loginUserDto.email}
            }
        )
        if(!user){
            throw new HttpException("Email is not exist", HttpStatus.UNAUTHORIZED);
        }

        const checkPass = bcrypt.compare(loginUserDto.password, user.password);
        if (!checkPass){
            throw new HttpException("Password is not correct", HttpStatus.UNAUTHORIZED);
        }
        //generate access token and refresh token
        const payload = {id: user.id, email: user.email};
        return await this.generateToken(payload);

    }

    async refreshToken(refreshToken: string): Promise<any>{
        try {
            const verify = await this.jwtService.verifyAsync(refreshToken, {
                secret: this.configService.get<string>('REFRESH')
            })
            const checkExistToken = await this.userRepository.findOneBy({email:verify.email, refreshToken: refreshToken});
            if (checkExistToken){
                return this.generateToken({id: verify.id, email: verify.email});
            } else {
                throw new HttpException("Invalid token", HttpStatus.BAD_REQUEST);
            }
        } catch (error) {
            throw new HttpException("Invalid token", HttpStatus.BAD_REQUEST);
        }
    }
    //payload: thonog tin chuoi ma hoa dua vao token
    //chuan bi payload su dung generateToken
    private async generateToken(payload: {id:number, email: string}){
        const access_token = await this.jwtService.signAsync(payload);
        const refresh_token = await this.jwtService.signAsync(payload, {
            secret: this.configService.get<string>('REFRESH'),
            expiresIn: this.configService.get<string>('EXP_IN_REFRESH_TOKEN')
        })
        await this.userRepository.update(
            {email: payload.email},
            {refreshToken: refresh_token}
        )
        return {access_token, refresh_token};
    }

    private async hashPassword(password: string): Promise<string>{
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const hash = await bcrypt.hash(password, salt);

        return hash;
    }


}
