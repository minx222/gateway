import CircuitBreaker from 'opossum';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import { AXIOS_INSTANCE_TOKEN } from './config';

@Injectable()
export class HttpService {
	breaker: CircuitBreaker;

	constructor(
		@Inject(AXIOS_INSTANCE_TOKEN)
		protected readonly instance: AxiosInstance = axios.create(),
	) {
		this.setupInterceptors();
	}

	setupInterceptors() {
		console.log('setupInterceptors');
		this.instance.interceptors.request.use(
			(
				config: InternalAxiosRequestConfig & {
					startTime: number;
				},
			) => {
				config.startTime = Date.now();
				return config;
			},
		);
		this.instance.interceptors.response.use(
			(
				res: AxiosResponse & {
					startTime: number;
				},
			) => {
				console.log('request', `${res.config.method} ${res.config.url} ${res.status} ${Date.now() - res.startTime}ms`);
				return res;
			},
			(error) => {
				console.log(
					'request: ',
					`${error.response.config.method} ${error.response.config.url}\n ${error.response.status} ${Date.now() - error.response.config.startTime}ms`,
				);
				return Promise.reject(error);
			},
		);
	}

	beforeEach(url: string) {
		return this.breaker.fire(url);
	}

	request<T = any, D = any>(config: AxiosRequestConfig<D>) {
		return this.instance.request<T>(config);
	}
}
