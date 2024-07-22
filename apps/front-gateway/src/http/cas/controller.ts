import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';

import { CasService } from './service';
import { CasServer } from '@app/front-gateway/entities/cas.entity';
import { Result } from '@libs/common';

@Controller('/cas')
export class CasController {
	constructor(private readonly casService: CasService) {}

	@Post('create')
	async create(@Body() casServer: CasServer) {
		const result = await this.casService.create(casServer);
		return Result.success(result);
	}

	@Get()
	findAll() {
		return this.casService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.casService.findOne(id);
	}

	@Post('updateById')
	update(@Body() casServer: CasServer) {
		return this.casService.updateById(casServer);
	}

	@Delete('removeById')
	removeById(@Param('id') id: string) {
		return this.casService.remove(+id);
	}
}
