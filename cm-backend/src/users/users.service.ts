import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepo.create(createUserDto);
    return await this.userRepo.save(user);
  }

  async findAll() {
    return await this.userRepo.find({
      relations: ['posts', 'comments'],
    });
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['posts', 'commnets'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);

    Object.assign(user, updateUserDto);

    return await this.userRepo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    await this.userRepo.remove(user);
    return { deleted: true };
  }
}
