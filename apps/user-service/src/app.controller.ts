import { Controller, Get } from '@nestjs/common';

import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Result } from '@app/common';
import Redis from 'ioredis';

@Controller('/app')
export class AppController {
	constructor(@InjectRedis() private readonly redis: Redis) {}

	@Get()
	getHello(): Result<string> {
		return Result.success('Hello World!');
	}
}
