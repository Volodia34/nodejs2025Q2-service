import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder, OpenAPIObject } from '@nestjs/swagger';
import * as YAML from 'js-yaml';
import { readFileSync } from 'fs';
import { join } from 'path';
import { AllExceptionsFilter } from './exception/exception.filter';
import { MyLogger } from './logger/custom-logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: false,
  });

  const logger = app.get(MyLogger);
  app.useLogger(logger);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter(logger));

  process.on('uncaughtException', (err, origin) => {
    logger.error(
      `Caught exception: ${err}. Exception origin: ${origin}.`,
      err.stack,
      'UncaughtException',
    );
  });

  process.on('unhandledRejection', (reason, promise) => {
    logger.error(
      `Unhandled Rejection at: ${promise}, reason: ${reason}`,
      '',
      'UnhandledRejection',
    );
  });

  app.useGlobalFilters(new AllExceptionsFilter(logger));
  app.useGlobalPipes(new ValidationPipe());

  try {
    const swaggerFilePath = join(__dirname, '..', 'doc', 'api.yaml');
    const swaggerDocument = YAML.load(
      readFileSync(swaggerFilePath, 'utf8'),
    ) as OpenAPIObject;
    SwaggerModule.setup('doc', app, swaggerDocument);
  } catch (error) {
    logger.error(
      'Failed to load Swagger documentation from file, using builder.',
      error.stack,
      'Swagger',
    );
    const options = new DocumentBuilder()
      .setTitle('Home Library Service')
      .setDescription('Home music library service')
      .setVersion('1.0.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('doc', app, document);
  }

  const port = process.env.PORT || 4000;
  await app.listen(port, () => {
    logger.log(`App is running on http://localhost:${port}`, 'Bootstrap');
    logger.log(
      `Swagger UI is available at http://localhost:${port}/doc`,
      'Bootstrap',
    );
  });
}

bootstrap();
