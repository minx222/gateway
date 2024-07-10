import { Injectable } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { BaseProxyService } from './base.service';
import { CasProxySercice } from '../cas-proxy/proxy.service';

@Injectable()
export class ProxyService {
	constructor(private readonly casProxyService: CasProxySercice) {}

	proxy(request: FastifyRequest, reply: FastifyReply) {
		const proxyType = request.headers['Proxy-type'] as string;
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
		console.log(proxyType);
		return this.casProxyService;
	}
}
