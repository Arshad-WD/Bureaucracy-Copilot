import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Set base API path
  app.setGlobalPrefix('api/v1');

  // Configure CORS
  app.enableCors({
    origin: ['http://localhost:3000', 'https://bureaucracycopilot.com', 'https://www.bureaucracycopilot.com'],
    credentials: true,
  });

  // Configure global validation piping
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  const port = process.env.PORT ?? 5000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}/api/v1`);
}
bootstrap();
