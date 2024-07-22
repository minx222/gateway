import { Injectable } from '@nestjs/common';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';

import { CasServer } from '@app/front-gateway/entities/cas.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CasService {
	constructor(
		@InjectRepository(CasServer)
		private casRepository: MongoRepository<CasServer>,
	) {}

	async create(casServer: CasServer) {
		casServer.proxyType = CasServer.Type;
		const user = await this.casRepository.save(casServer);
		return user;
	}

	async findAll() {
		return this.casRepository.find();
	}

	async findOne(id: string) {
		const app = await this.casRepository.findOne({
			where: {
				_id: new ObjectId(id),
			},
		});
		return app;
	}

	updateById(casServer: CasServer) {
		return `This action updates a #${casServer.appId} user`;
	}

	remove(id: number) {
		return `This action removes a #${id} user`;
	}
}
