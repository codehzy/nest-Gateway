declare const module: any;

import { VersioningType, VERSION_NEUTRAL } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import {
  AllExceptionFilter,
  HttpExceptionFilter,
} from './user/common/exceptions/base.exception.filter';
import { TransformInterceptor } from './user/common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
  // 启用版本配置
  app.enableVersioning({
    defaultVersion: [VERSION_NEUTRAL, '1', '2'],
    type: VersioningType.URI,
  });
  app.useGlobalInterceptors(new TransformInterceptor());
  // 全局异常拦截器
  app.useGlobalFilters(new AllExceptionFilter(), new HttpExceptionFilter());
  await app.listen(3000);
}
bootstrap();
