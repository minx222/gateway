import { FastifyReply, FastifyRequest } from 'fastify';

export abstract class BaseProxyService {
	abstract proxy(request: FastifyRequest, respone: FastifyReply): Promise<any>;
	abstract login(request: FastifyRequest, respone: FastifyReply): Promise<any>;
	abstract checkToken(request: FastifyRequest, respone: FastifyReply): Promise<any>;
}
