import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
    ){}

    async register(registerUserDto: RegisterUserDto): Promise<User>{
        const hashPassword = await this.hashPassword(registerUserDto.password);
        return await this.userRepository.save({...registerUserDto, password: hashPassword, refreshToken: "huhu"});
    }
    private async hashPassword(password: string): Promise<string>{
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const hash = await bcrypt.hash(password, salt);

        return hash;
    }
}