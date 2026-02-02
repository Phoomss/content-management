import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { Post } from '../posts/entities/post.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepo: Repository<Comment>,

    @InjectRepository(Post)
    private postRepo: Repository<Post>,

    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create(createCommentDto: CreateCommentDto) {
    const post = await this.postRepo.findOne({
      where: { id: createCommentDto.postId },
    });

    if (!post) throw new NotFoundException('Post not found');

    const user = await this.userRepo.findOne({
      where: { id: createCommentDto.userId },
    });

    if (!user) throw new NotFoundException('User not found');

    const comment = this.commentRepo.create({
      message: createCommentDto.message,
      post,
      user,
    });

    return await this.commentRepo.save(comment);
  }

  async findAll() {
    return await this.commentRepo.find({
      relations: ['user', 'post'],
    });
  }

  async findOne(id: number) {
    const comment = await this.commentRepo.findOne({
      where: { id },
      relations: ['user', 'comment'],
    });

    if (!comment) throw new NotFoundException('comment not found');

    return comment;
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    const comment = await this.commentRepo.findOne({
      where: { id },
    });

    if (!comment) throw new NotFoundException('Comment not found');

    Object.assign(comment, updateCommentDto);

    return await this.commentRepo.save(comment);
  }

  async remove(id: number) {
    const comment = await this.commentRepo.findOne({
      where: { id },
    });

    if (!comment) throw new NotFoundException('Comment not found');

    await this.commentRepo.remove(comment);

    return { deleted: true };
  }
}
