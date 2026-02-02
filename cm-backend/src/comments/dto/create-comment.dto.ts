import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsNumber()
  postId: number;

  @IsNumber()
  userId: number;
}
