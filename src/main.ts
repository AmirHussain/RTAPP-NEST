import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { SwaggerDocumentOptions } from './swagger-option';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Real Time Chat App')
    .setDescription('The CHAT API description')
    .setVersion('1.0')
    .build();
    const options: SwaggerDocumentOptions = {
      deepScanRoutes: true
  };
  const document = SwaggerModule.createDocument(app, config,options);
  SwaggerModule.setup('api', app, document);
  app.enableCors();

  await app.listen(3000);
}
bootstrap();
