import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';

import { ApplicationModule } from './app.module';

(async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    const port = 3000;
    const app = await NestFactory.create(ApplicationModule);

    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    await app.listen(port);

    logger.log(`Server is running on port ${port}`);
  } catch (error) {
    logger.error('Filed to startup the Server!', error.trace);
  }
})();
