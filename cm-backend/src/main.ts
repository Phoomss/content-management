import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/transform/transform.interceptor';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // response with data
  app.useGlobalInterceptors(new TransformInterceptor());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // ตัด field แปลก ๆ ทิ้ง
      forbidNonWhitelisted: true, // ส่ง field เกิน = error
      transform: true, // แปลง string -> number
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
