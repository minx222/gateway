import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

import { getConfig, AllExceptionsFilter, HttpExceptionFilter } from '@app/common';

declare const module: any;
async function bootstrap() {
	const config = getConfig();
	const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

	// 跨域
	app.enableCors({
		origin: '*',
		credentials: true,
	});

	// 异常过滤器
	app.useGlobalFilters(new AllExceptionsFilter(), new HttpExceptionFilter());

	// 设置全局接口前缀
	app.setGlobalPrefix('api');

	// 接口版本化管理
	app.enableVersioning({
		type: VersioningType.URI,
	});
	// 启动全局字段校验，保证请求接口字段校验正确。
	app.useGlobalPipes(new ValidationPipe());
	await app.listen(config.server.port);
	console.log(`Application is running on: ${config.server.port}`)
	// 添加热更新
	if (module.hot) {
		module.hot.accept();
		module.hot.dispose(() => app.close());
	}
}
bootstrap();
