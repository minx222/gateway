import { Module } from '@nestjs/common';
import { CasController } from './controller';
import { CasService } from './service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CasServer } from '../entities/cas.entity';
import { CasProxySercice } from './proxy.service';
import { HttpModule } from '@nestjs/axios';

@Module({
	controllers: [CasController],
	providers: [CasService, CasProxySercice],
	imports: [
		TypeOrmModule.forFeature([CasServer]),
		HttpModule.register({
			timeout: 10 * 1000,
			maxRedirects: 5,
		}),
	],
	exports: [CasProxySercice],
})
export class CasModule {}
