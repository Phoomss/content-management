import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsNumber()
  authorId: number;
}
