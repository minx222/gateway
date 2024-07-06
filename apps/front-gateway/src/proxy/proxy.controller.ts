import { Body, Controller, Get, Req, RequestMapping, RequestMethod, Res } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify'
import { ProxyService } from './proxy.service';
import { Result } from '@app/common';

@Controller("sso")
export class ProxyController {

	constructor(private proxyServier: ProxyService) {}

	@RequestMapping({
		path: '/proxy/*',
		method: RequestMethod.ALL
	})
	proxy(
		@Req() request: FastifyRequest, 
    @Res() reply: FastifyReply
	) {
		return this.proxyServier.proxy(request, reply)
	}

	@RequestMapping({
		path: "/login",
		method: RequestMethod.ALL
	})
	login(@Req() request: FastifyRequest, 	@Res() reply: FastifyReply) {
		this.proxyServier.login(request, reply)
	}


	@RequestMapping({
		path: "/checkToken",
		method: RequestMethod.ALL
	})
	checkToken(@Req() request: FastifyRequest,  @Res() reply: FastifyReply) {
		this.proxyServier.checkToken(request, reply)
	}

}
