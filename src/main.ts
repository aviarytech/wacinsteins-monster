import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastify from 'fastify';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const server = fastify();

  server.addContentTypeParser(
    'application/didcomm-encrypted+json',
    function (request, payload, done) {
      var data = '';
      payload.on('data', (chunk) => {
        data += chunk;
      });
      payload.on('end', () => {
        done(null, JSON.parse(data));
      });
    },
  );

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(server),
  );
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.SERVER_PORT ?? 3100, '0.0.0.0');
}
bootstrap();
