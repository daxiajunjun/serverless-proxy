import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import * as serverless from 'serverless-http';
import * as helmet from 'helmet';
import { AppModule } from './module';
import * as proxy from 'express-http-proxy';

function proxyOpenAIHost() {
  return 'https://api.openai.com';
}

const bootstrap = async (module: any) => {
  const app = express();
  const nestApp = await NestFactory.create(module, new ExpressAdapter(app));

  nestApp.setGlobalPrefix('/.netlify/functions/server');
  nestApp.enableCors();
  nestApp.use(helmet());
  nestApp.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  nestApp.use(
    '/.netlify/functions/server/proxy_openai',
    proxy(proxyOpenAIHost, {
      proxyReqPathResolver: function () {
        return '/v1/chat/completions';
      },
    }),
  );
  nestApp.use(express.json({ limit: '50mb' }));
  nestApp.use(express.urlencoded({ limit: '50mb', extended: true }));

  await nestApp.init();
  // nestApp.listen(3005);
  return app;
};

// bootstrap(AppModule);

let cachedHadler: any;
const proxyApi = async (module: any, event: any, context: any) => {
  if (!cachedHadler) {
    const app = await bootstrap(module);
    cachedHadler = serverless(app);
  }

  return cachedHadler(event, context);
};

export const handler = async (event: any, context: any) =>
  proxyApi(AppModule, event, context);
