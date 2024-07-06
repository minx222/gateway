import { BadRequestException, Injectable } from '@nestjs/common';
import { CasService } from './service';
import { HttpService } from '@nestjs/axios';
import type { AxiosResponse, AxiosRequestConfig } from 'axios'
import { BaseProxyService } from '../proxy/base.service';
import * as path from 'path';
import { FastifyReply, FastifyRequest } from 'fastify';
import * as crypto from 'crypto-js';
import { CasServer } from '../entities/cas.entity';
import { Result } from '@app/common';
import { Parser } from 'xml2js';
import { InjectRedis } from "@liaoliaots/nestjs-redis";
import Redis from "ioredis";
import * as qs from 'qs'
import { catchError, map } from 'rxjs';

@Injectable()
export class CasProxySercice extends BaseProxyService {
	parse: Parser;
	constructor(
		private readonly casService: CasService,
		private readonly httpService: HttpService,
		@InjectRedis() private readonly redis: Redis,
	) {
		super();
		this.parse = new Parser();
		this.httpService.axiosRef.interceptors.request.use((config) => {
			// @ts-ignore
			config.startTime = Date.now();
			return config;
		})
		this.httpService.axiosRef.interceptors.response.use((res) => {
			// @ts-ignore
			config.startTime = Date.now();
			console.log(res, 'res');
			return res;
		})
	}

	async proxy(request: FastifyRequest, reply: FastifyReply) {
		const appId = request.headers['appid'] as string;
		if (!appId) {
			reply.send(Result.error('需要提供appid'))
			console.log(appId, 'res.data')
			throw new Error('需要提供appid');
		}
		const auth = request.headers['authorization'] as string;
		const app = await this.casService.findOne(appId);
		if (!auth) {
			reply.send(Result.errorData({
				url: path.join(app.casUrl, '/login')
			}, 'token不存在'))
			throw new Error('token不存在');
		}
		const value = await this.redis.get(auth)
		const tokenValue = qs.parse(value);
		if (!tokenValue.appId || tokenValue.appId !== appId) {
			reply.send(Result.error('token与appid不匹配'))
			throw new Error('token与appid不匹配');
		}
		const headers = request.headers
		headers[app.cookieName] = tokenValue.token as string;
		headers['authorization'] = undefined
		headers['referer'] = undefined
		headers['host'] = undefined
		this.request({
			method: request.method,
			data: request.body,
			params: request.params,
			headers,
			url: path.join(app.serverUrl, request.url.replace('/api/sso/proxy', '')),
		}).then((res) => {
			reply.send(res)
		}, (err) => {
			reply.send(err.message)
		})
	}

	async login(request: FastifyRequest, reply: FastifyReply): Promise<any> {
		const data = JSON.parse(request.body as string) as {
			ticket: string;
		};
		if (!data.ticket) {
			reply.send(Result.error('ticket不存在'));
			throw new Error('ticket不存在');
		}
		const appId = request.headers['appid'] as string;
		if (!appId) {
			reply.send(Result.error('需要提供appid'));
			throw new Error('需要提供appid');
		}
		const app = await this.casService.findOne(appId);
		if (!appId) {
			reply.send(Result.error('服务不存在'));
			throw new Error('服务不存在');
		}
		this.handleTicket(app, request.headers['ticketurl'] as string, data.ticket).then(
			(res) => {
				// 存token
				const tokenValue = qs.stringify({
					token: res,
					appId: appId,
				});
				const accessToken = crypto.MD5(res).toString();
				// accessToken
				this.redis.set(accessToken, tokenValue)
				this.redis.expire(accessToken, 60 * 60 * 24 * 7)
				reply.send(Result.success(accessToken));
			},
			(err) => {
				reply.send(Result.error(err));
			},
		);
	}

	handleTicket(server: CasServer, requestUrl: string, ticket: string) {
		let _validateUri = '/validate';
		if (server.casVersion == '2.0') {
			_validateUri = '/serviceValidate';
		} else if (server.casVersion == '3.0') {
			_validateUri = '/p3/serviceValidate';
		}
		const url = `${server.casUrl}${_validateUri}?service=${requestUrl}&ticket=${ticket}`;
		console.log(url, 'url')
		return new Promise<string>((resolve, reject) => {
			this.request<string>({
				url,
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			}).then((res) => {
				resolve(res)
			})
		});
	}

	request<T = any>(config: AxiosRequestConfig & {
		count?: number
		startTimer?: number
	}) {
		if (!config.startTimer) {
			config.startTimer = Date.now();
		}
		return new Promise<T>((resolve, reject) => {
			const request = this.httpService.request(config);
			request.pipe(
				map(res => {
					if (res.status === 200) {
						resolve(res.data);
						return;
					} else if (!config.count || config.count < 3) {
						config.count = config.count ? config.count + 1 : 1;
						this.request(config).then(resolve, reject);
					} else {
						reject(res)
					}
				}),
				catchError((err) => {
					if (!config.count || config.count < 3) {
						config.count = config.count ? config.count + 1 : 1;
						this.request(config).then(resolve, reject);
					} else {
						reject(err)
					}
					return err
				})
			).subscribe(() => {
				console.log(`${config.method} ${config.url} ${Date.now() - config.startTimer}ms`)
			})
		});
	}

	async checkToken(request: FastifyRequest, reply: FastifyReply): Promise<any> {
		const appId = request.headers['appid'] as string;
		if (!appId) {
			reply.send(Result.error('需要提供appid'));
			return;
		}
		const app = await this.casService.findOne(appId);
		const token = request.headers['authorization'];
		if (!token) {
			reply.send(
				Result.errorData(
					{
						url: path.join(app.casUrl, '/login'),
					},
					'需要提供token',
				),
			);
			return;
		}
		reply.send(Result.success('已登陆'));
	}

	parseCasXML(xml: string) {
		return new Promise((resolve, reject) => {
			this.parse.parseString(xml, (err, res) => {
				if (err) {
					reject(err);
					return;
				}
				const respone = res['cas:serviceResponse'];
				if (!respone) {
					reject(xml);
				}
				if (respone['cas:authenticationFailure']) {
					reject(respone['cas:authenticationFailure'][0]['_']);
				}

				const authenticationSucces = respone['cas:authenticationSuccess'][0];
				if (!authenticationSucces) {
					reject('authenticationSucces不存在');
				}
				const attributes = authenticationSucces['cas:attributes'][0];
				if (!attributes) {
					reject('attributes不存在');
				}
				resolve(attributes['cas:casToken'][0]);
			});
		});
	}
}
