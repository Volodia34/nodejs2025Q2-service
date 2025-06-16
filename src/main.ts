import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder, OpenAPIObject } from '@nestjs/swagger';
import { readFileSync, existsSync } from 'fs';
import * as YAML from 'js-yaml';
import { join } from 'path';
import { MyLogger } from './logger/MyLogger';
import { AllExceptionsFilter } from './exception/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  const port = process.env.PORT || 4000;

  const logger = app.get(MyLogger);
  app.useLogger(logger);

  app.useGlobalFilters(new AllExceptionsFilter(logger));

  try {
    const swaggerFilePath = join(__dirname, '..', 'doc', 'api.yaml');
    console.log('Trying to load Swagger from:', swaggerFilePath);

    if (existsSync(swaggerFilePath)) {
      const swaggerFile = readFileSync(swaggerFilePath, 'utf8');
      const swaggerDocument = YAML.load(swaggerFile) as OpenAPIObject;
      SwaggerModule.setup('doc', app, swaggerDocument);
      console.log('Swagger documentation loaded from YAML file');
    } else {
      console.log('YAML file not found, using code approach');
      const options = new DocumentBuilder()
        .setTitle('Home Library Service')
        .setDescription('Home music library service')
        .setVersion('1.0.0')
        .addBearerAuth()
        .build();
      const document = SwaggerModule.createDocument(app, options);
      SwaggerModule.setup('doc', app, document);
      console.log('Swagger documentation created programmatically');
    }
  } catch (error) {
    console.error(' Failed to load Swagger documentation', error);
  }

  await app.listen(port, () => {
    console.log(`App is running on http://localhost:${port}`);
    console.log(`Swagger UI is available at http://localhost:${port}/doc`);
  });
}

bootstrap();
