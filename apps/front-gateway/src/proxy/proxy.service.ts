import { Injectable } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { BaseProxyService } from './base.service';
import { CasProxySercice } from '@app/front-gateway/http/cas/proxy.service';
import { OauthProxySercice } from '../http/oauth/proxy.service';
import { OauthServer } from '../entities';

@Injectable()
export class ProxyService {
	constructor(
		private readonly casProxyService: CasProxySercice,
		private readonly oauthProxyService: OauthProxySercice,
	) {}

	proxy(request: FastifyRequest, reply: FastifyReply) {
		const proxyType = request.headers['Proxytype'] as string;
		const service = this.adater(proxyType);
		service.proxy(request, reply);
	}

	login(request: FastifyRequest, reply: FastifyReply) {
		const proxyType = request.headers['Proxy-type'] as string;
		const service = this.adater(proxyType);
		service.login(request, reply);
	}

	checkToken(request: FastifyRequest, reply: FastifyReply) {
		const proxyType = request.headers['Proxy-type'] as string;
		const service = this.adater(proxyType);
		service.checkToken(request, reply);
	}

	adater(proxyType: string): BaseProxyService {
		if (proxyType === OauthServer.Type) {
			return this.oauthProxyService;
		}
		return this.casProxyService;
	}
}
