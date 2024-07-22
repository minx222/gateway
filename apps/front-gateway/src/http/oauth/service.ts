import { Injectable } from '@nestjs/common';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';

import { OauthServer } from '../../entities/oauth.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OauthService {
	constructor(
		@InjectRepository(OauthServer)
		private oauthRepository: MongoRepository<OauthServer>,
	) {}

	async create(casServer: OauthServer) {
		casServer.proxyType = OauthServer.Type;
		const user = await this.oauthRepository.save(casServer);
		return user;
	}

	async findAll() {
		return this.oauthRepository.find();
	}

	async findOne(id: string) {
		const app = await this.oauthRepository.findOne({
			where: {
				_id: new ObjectId(id),
			},
		});
		return app;
	}

	updateById(casServer: OauthServer) {
		return `This action updates a #${casServer.appId} user`;
	}

	remove(id: number) {
		return `This action removes a #${id} user`;
	}
}
