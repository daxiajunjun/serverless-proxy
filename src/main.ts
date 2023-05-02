import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import * as helmet from 'helmet';
import { AppModule } from './module';
import * as proxy from 'express-http-proxy';

function proxyOpenAIHost() {
  return 'https://api.openai.com';
}

const bootstrap = async (module: any) => {
  const app = express();
  const nestApp = await NestFactory.create(module, new ExpressAdapter(app));

  nestApp.enableCors();
  nestApp.use(helmet());
  nestApp.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  nestApp.use(
    '/proxy_openai',
    proxy(proxyOpenAIHost, {
      proxyReqPathResolver: function () {
        return '/v1/chat/completions';
      },
    }),
  );
  nestApp.use(express.json({ limit: '50mb' }));
  nestApp.use(express.urlencoded({ limit: '50mb', extended: true }));

  await nestApp.init();
  nestApp.listen(3005);
  return app;
};

bootstrap(AppModule);
