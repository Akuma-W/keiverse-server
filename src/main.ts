import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  // Create app instance
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Helmet: Security headers
  app.use(helmet());
  // CORS: allows requests from the frontend application
  app.enableCors({
    origin: configService.get<string[]>('app.cors.origins'),
    credentials: true,
  });
  // Cookie parser
  app.use(cookieParser());
  // Global pipes (validation)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  // API versioning
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: configService.get<string>('app.version'),
  });

  // Setup Swagger with Bearer Auth (JWT) and brief docs
  const swaggerConfig = new DocumentBuilder()
    .setTitle(configService.get<string>('app.name') || 'KEIVerse API')
    .setDescription('Interactive Learning Platform API documentation')
    .setVersion(configService.get<string>('app.version') || '1')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT access token: Bearer <token>',
      },
      'access-token',
    )
    .addCookieAuth('refreshToken')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(
    configService.get<string>('app.swagger.path') || 'api/docs',
    app,
    document,
  );

  // ---------- Start server ----------
  const port = configService.get<number>('app.port') || 3000;
  await app.listen(port);

  console.log(`🚀 Server is running at http://localhost:${port}`);
  console.log(`📚 API docs available at http://localhost:${port}/api/docs`);
}
// Handle bootstrap errors
bootstrap().catch((err) => {
  console.error('❌ Server failed to start', err);
  process.exit(1);
});
