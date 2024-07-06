import { Module } from '@nestjs/common';
import { ProxyService } from './proxy.service';
import { ProxyController } from './proxy.controller';

import { CasModule } from '../cas-proxy/module'

@Module({
  controllers: [ProxyController],
  providers: [ProxyService],
	imports: [CasModule]
})
export class ProxyModule {}
