import { Module } from '@nestjs/common';
import { OauthController } from './controller';
import { OauthService } from './service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OauthServer } from '../../entities/oauth.entity';
import { OauthProxySercice } from './proxy.service';

import { HttpRequestModule } from '@libs/common';

@Module({
	controllers: [OauthController],
	providers: [OauthService, OauthProxySercice],
	imports: [TypeOrmModule.forFeature([OauthServer]), HttpRequestModule],
	exports: [OauthProxySercice],
})
export class OauthModule {}
