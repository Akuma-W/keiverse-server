import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionsFilter } from './common/exceptions/http-exception.filter';

async function bootstrap() {
  // Create app instance
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const reflector = app.get(Reflector);

  // Security
  app.use(helmet());
  app.enableCors({
    origin: configService.get<string>('app.frontendUrl'),
  });
  // Cookie parser
  app.use(cookieParser());
  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  // Global guards
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  // Global interceptors
  app.useGlobalInterceptors(new ResponseInterceptor());
  // Global filters
  app.useGlobalFilters(new HttpExceptionsFilter());
  // API versioning
  app.setGlobalPrefix(configService.get('app.apiPrefix') ?? 'api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // ---------- Swagger (OpenAPI) ----------
  // Setup Swagger with Bearer Auth (JWT) and brief docs.
  const swaggerConfig = new DocumentBuilder()
    .setTitle('KEIVerse API')
    .setDescription(
      'KEIVerse — Interactive Learning Platform API documentation',
    )
    .setVersion('1.0')
    // Add Bearer token support for Authorization header
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
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  // ---------- Start server ----------
  const port = configService.get<number>('app.port') || 3000;
  await app.listen(port);
  console.log(
    `🚀 Server is running at http://localhost:${configService.get('PORT') || 3000}`,
  );
  console.log(
    `📘 Swagger: http://localhost:${configService.get('PORT') || 3000}/api/docs`,
  );
}

bootstrap().catch((err) => {
  console.error('Failed to bootstrap application', err);
  process.exit(1);
});
