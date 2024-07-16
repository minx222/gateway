import { Module } from '@nestjs/common';
import { HttpService } from './request.service';
import { AXIOS_INSTANCE_TOKEN } from './config';
import axios from 'axios';

@Module({
	providers: [
		HttpService,
		{
			provide: AXIOS_INSTANCE_TOKEN,
			useValue: axios.create(),
		},
	],
	exports: [HttpService],
})
export class HttpRequestModule {}
