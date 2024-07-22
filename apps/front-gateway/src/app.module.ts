import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { HttpModule } from '@nestjs/axios';
import { OauthModule } from './http/oauth/module';
import { CasModule } from './http/cas/module';
import { ProxyModule } from './proxy/proxy.module';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MongoDBProperties } from '@libs/common';
import { RedisProperties } from '@libs/cache';
import { entities } from './entities';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { AppController } from './app.controller';
@Module({
	imports: [
		HttpModule,
		OauthModule,
		CasModule,
		ProxyModule,
		RedisModule.forRoot({
			config: new RedisProperties(),
		}),
		CacheModule.register(),
		TypeOrmModule.forRoot({
			...new MongoDBProperties(),
			entities,
		}),
	],
	controllers: [AppController],
})
export class AppModule {}
