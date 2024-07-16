import { Controller, Req, RequestMapping, RequestMethod, Res } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ProxyService } from './proxy.service';

@Controller()
export class ProxyController {
	constructor(private proxyServier: ProxyService) {}

	@RequestMapping({
		path: '/proxy/*',
		method: RequestMethod.ALL,
	})
	proxy(@Req() request: FastifyRequest, @Res() reply: FastifyReply) {
		return this.proxyServier.proxy(request, reply);
	}

	@RequestMapping({
		path: '/sso/login',
		method: RequestMethod.ALL,
	})
	login(@Req() request: FastifyRequest, @Res() reply: FastifyReply) {
		this.proxyServier.login(request, reply);
	}

	@RequestMapping({
		path: '/sso/checkToken',
		method: RequestMethod.ALL,
	})
	checkToken(@Req() request: FastifyRequest, @Res() reply: FastifyReply) {
		this.proxyServier.checkToken(request, reply);
	}
}
