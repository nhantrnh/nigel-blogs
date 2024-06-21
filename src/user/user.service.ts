import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DeleteResult, Like, Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
@Injectable()
export class UserService {
    [x: string]: any;

    constructor(@InjectRepository(User) private userRepository: Repository<User>) {}
    async findAll(query: FilterUserDto): Promise<any> {
        const items_per_page = query.items_per_page ? parseInt(query.items_per_page) : 5;
        const page = Number(query.page)|| 1;
        // skip: bo qua bao nhieu items
        // take: lay bao nhieu items
        const skip = (page -1) * items_per_page;
        //total: tong so items
        const keyword = query.search ? query.search : '';
        const[res, total] = await this.userRepository.findAndCount({
            where: [
                {firstName: Like(`%${keyword}%`)},
                {lastName: Like(`%${keyword}%`)},
                {email: Like(`%${keyword}%`)}
            ],
            order: {createAt: 'DESC'},
            take: items_per_page,
            skip: skip,
            select: ['id', 'firstName', 'lastName', 'email', 'status', 'createAt', 'updateAt']
        })
        const lastPage = Math.ceil(total/items_per_page);
        const nextPage = page + 1 > lastPage ? null : page + 1;
        const prevPage = page - 1 <= 0 ? null : page - 1;

        return {
            data: res,
            total,
            currentPage: page,
            nextPage,
            prevPage,
            lastPage
        }
    }

    async findOne(id: number): Promise<User> {
        return await this.userRepository.findOneBy({ id });
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const hashPassword = await bcrypt.hash(createUserDto.password, 10);
        return await this.userRepository.save(createUserDto);
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<UpdateResult> {
        return await this.userRepository.update(id, updateUserDto);
    }

    async delete(id: number): Promise<DeleteResult> {
        return await this.userRepository.delete(id);
    }
}
