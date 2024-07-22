import { Injectable } from '@nestjs/common';
import { OauthService } from './service';
import { BaseProxyService } from '../../proxy/base.service';
import * as path from 'path';
import { FastifyReply, FastifyRequest } from 'fastify';
import * as crypto from 'crypto-js';
import { OauthServer } from '../../entities/oauth.entity';
import { HttpService, Result, ResultCode } from '@libs/common';
import { Parser } from 'xml2js';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import * as qs from 'qs';
import md5 from 'md5';
import URI from 'urijs';
import { ResultErrorCode } from './constants';
import { nanoid } from 'nanoid';

@Injectable()
export class OauthProxySercice extends BaseProxyService {
	parse: Parser;
	constructor(
		private readonly oauthService: OauthService,
		private readonly httpService: HttpService,
		@InjectRedis() private readonly redis: Redis,
	) {
		super();
		this.parse = new Parser();
	}

	async proxy(request: FastifyRequest, reply: FastifyReply) {
		const appId = request.headers['appid'] as string;
		if (!appId) {
			reply.send(Result.error('需要提供appid'));
			return;
		}
		const auth = request.headers['authorization'] as string;
		const app = await this.oauthService.findOne(appId);
		if (!auth) {
			reply.send(
				Result.errorData(
					{
						url: path.join(app.casUrl, '/login'),
					},
					'token不存在',
				),
			);
			return;
		}
		const value = await this.redis.get(auth);
		if (!value) {
			const app = await this.oauthService.findOne(appId);
			reply.send(new Result(ResultCode.Unauthorized, app.casUrl + '/login', 'token过期'));
		}
		const tokenValue = qs.parse(value);
		if (!tokenValue.appId || tokenValue.appId !== appId) {
			console.log(value, tokenValue, appId, '1231');
			reply.send(Result.error('token与appid不匹配'));
			return;
		}
		const headers = request.headers;
		console.log(tokenValue.token, 'tokenValue.token');
		headers[app.cookieName] = tokenValue.token as string;
		headers['authorization'] = undefined;
		headers['referer'] = undefined;
		headers['host'] = undefined;
		const options = {
			method: request.method,
			data: request.body,
			params: request.params,
			headers,
			url: path.join(app.serverUrl, request.url.replace('/api/proxy', '')),
		};
		this.httpService.request(options).then(
			(res) => {
				const { success, errorCode, errorMsg } = res.data;
				if (!success) {
					if (ResultErrorCode.Unauthorized === errorCode) {
						reply.send(new Result(ResultCode.Unauthorized, app.casUrl + '/login', errorMsg));
						console.log(res.data);
						return;
					}
				}
				reply.send(res);
			},
			(err) => {
				reply.send(Result.error(err));
			},
		);
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
		const app = await this.oauthService.findOne(appId);
		if (!appId) {
			reply.send(Result.error('服务不存在'));
			throw new Error('服务不存在');
		}
		this.handleTicket(app, request.headers['ticketurl'] as string, data.ticket)
			.then((res) => {
				return this.fetchToken(res, app);
			})
			.then(
				(res) => {
					const token = res.data;
					// 存token
					const tokenValue = qs.stringify({
						token: res,
						appId: appId,
					});
					const accessToken = crypto.MD5(token).toString();
					// accessToken
					this.redis.set(accessToken, tokenValue);
					this.redis.expire(accessToken, 60 * 24 * 7);
					reply.send(Result.success(accessToken));
				},
				(err) => {
					reply.send(Result.error(err));
				},
			);
	}

	fetchToken(username: string, server: OauthServer) {
		const data = {
			clientId: server.clientId,
			nonce: md5(nanoid()),
			timestamp: Date.now(),
			username,
		};
		const dataString = qs.stringify(data, { delimiter: '' });
		const raw = `${dataString}${server.clientSecret}`;
		const signature = md5(raw);
		Object.assign(data, {
			signature,
		});
		const uri = new URI(server.tokenServer);
		uri.segment('oauth/username/token');
		return this.httpService.post(
			uri.toString(),
			{},
			{
				headers: {
					Accept: 'application/json',
				},
				params: data,
			},
		);
	}

	handleTicket(server: OauthServer, requestUrl: string, ticket: string) {
		let _validateUri = '/validate';
		if (server.casVersion == '2.0') {
			_validateUri = '/serviceValidate';
		} else if (server.casVersion == '3.0') {
			_validateUri = '/p3/serviceValidate';
		}
		const url = `${server.casUrl}${_validateUri}?service=${encodeURIComponent(requestUrl)}&ticket=${ticket}`;
		return new Promise<string>((resolve, reject) => {
			this.httpService
				.request<string>({
					url,
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
				})
				.then((res) => {
					return this.parseOauthXML(res.data);
				})
				.then(resolve, reject);
		});
	}

	async checkToken(request: FastifyRequest, reply: FastifyReply): Promise<any> {
		const appId = request.headers['appid'] as string;
		if (!appId) {
			reply.send(Result.error('需要提供appid'));
			return;
		}
		const app = await this.oauthService.findOne(appId);
		const token = request.headers['authorization'];
		// const token = request.cookies['Authorization'];
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
		const value = await this.redis.get(token);
		if (!value) {
			reply.send(
				Result.errorData(
					{
						url: path.join(app.casUrl, '/login'),
					},
					'token过期',
				),
			);
			return;
		}
		reply.send(Result.success('已登陆'));
	}

	parseOauthXML(xml: string) {
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
