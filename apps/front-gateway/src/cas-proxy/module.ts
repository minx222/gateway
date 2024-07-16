import { Module } from '@nestjs/common';
import { CasController } from './controller';
import { CasService } from './service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CasServer } from '../entities/cas.entity';
import { CasProxySercice } from './proxy.service';

import { HttpRequestModule } from '@app/common';

@Module({
	controllers: [CasController],
	providers: [CasService, CasProxySercice],
	imports: [TypeOrmModule.forFeature([CasServer]), HttpRequestModule],
	exports: [CasProxySercice],
})
export class CasModule {}
