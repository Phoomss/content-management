import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { User } from '../users/entities/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepo: Repository<Post>,

    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create(createPostDto: CreatePostDto) {
    const author = await this.userRepo.findOne({
      where: { id: createPostDto.authorId },
    });

    if (!author) {
      throw new NotFoundException('Author not found');
    }

    const post = this.postRepo.create({
      title: createPostDto.title,
      content: createPostDto.content,
      author,
    });

    return await this.postRepo.save(post);
  }

  async findAll() {
    return await this.postRepo.find({
      relations: ['author', 'comments'],
    });
  }

  async findOne(id: number) {
    const post = await this.postRepo.findOne({
      where: { id },
      relations: ['author', 'comments'],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const post = await this.findOne(id);

    Object.assign(post, updatePostDto);

    return await this.postRepo.save(post);
  }

  async remove(id: number) {
    const post = await this.findOne(id);
    await this.postRepo.remove(post);

    return { deleted: true };
  }
}
