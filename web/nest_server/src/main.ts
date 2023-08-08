import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import './CONSTANTS'
import { OverrideWsAdapter } from './util/OverrideWsAdapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors()
  app.useWebSocketAdapter(new OverrideWsAdapter(app));
  await app.listen(3000);
}
bootstrap();
