import { Controller, Get, Param } from '@nestjs/common';

import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Result } from '@libs/common';
import Redis from 'ioredis';

@Controller('/app')
export class AppController {
	constructor(@InjectRedis() private readonly redis: Redis) {}

	@Get()
	getHello(): Result<string> {
		return Result.success('Hello World!');
	}

	@Get('setValue/:key/:value')
	setValue(@Param('key') key: string, @Param('value') value: string): Result<string> {
		this.redis.set(key, value);
		return Result.success('set');
	}

	@Get('getValue/:key')
	async getValue(@Param('key') key: string) {
		return Result.success(await this.redis.get(key));
	}
}
