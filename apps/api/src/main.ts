import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // WebSocket adapter
  app.useWebSocketAdapter(new IoAdapter(app));

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('SafePulse API')
    .setDescription('Emergency Response System API for Ghana')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('incidents', 'Emergency incident management')
    .addTag('dispatch', 'Unit dispatch and assignment')
    .addTag('units', 'Response unit management')
    .addTag('users', 'User management')
    .addTag('contacts', 'Emergency contacts')
    .addTag('kyc', 'Identity verification')
    .addTag('ussd', 'USSD intake channel')
    .addTag('dispatcher', 'Dispatcher operations')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`SafePulse API running on http://localhost:${port}`);
  console.log(`Swagger docs available at http://localhost:${port}/api/docs`);
}

bootstrap();
