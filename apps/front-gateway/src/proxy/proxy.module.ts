import { Module } from '@nestjs/common';
import { ProxyService } from './proxy.service';
import { ProxyController } from './proxy.controller';

import { OauthModule } from '../http/oauth/module';
import { CasModule } from '@app/front-gateway/http/cas/module';

@Module({
	controllers: [ProxyController],
	providers: [ProxyService],
	imports: [OauthModule, CasModule],
})
export class ProxyModule {}
