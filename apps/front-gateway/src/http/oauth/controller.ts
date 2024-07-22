import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';

import { OauthService } from './service';
import { OauthServer } from '../../entities/oauth.entity';
import { Result } from '@libs/common';

@Controller('/oauth')
export class OauthController {
	constructor(private readonly oauthService: OauthService) {}

	@Post('create')
	async create(@Body() casServer: OauthServer) {
		const result = await this.oauthService.create(casServer);
		return Result.success(result);
	}

	@Get()
	findAll() {
		return this.oauthService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.oauthService.findOne(id);
	}

	@Post('updateById')
	update(@Body() casServer: OauthServer) {
		return this.oauthService.updateById(casServer);
	}

	@Delete('removeById')
	removeById(@Param('id') id: string) {
		return this.oauthService.remove(+id);
	}
}
