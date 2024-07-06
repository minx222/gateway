import { HttpModule as AxiosHttpModule, HttpService } from '@nestjs/axios';
import { Global, Module, OnModuleInit } from '@nestjs/common';
// import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

// import { Logger } from '@app/common/Logger';
// import {
//   createReqInterceptor,
//   createRespFailInterceptor,
//   createRespSuccessInterceptor,
// } from '@app/common/http/http.interceptors';

@Global()
@Module({
  imports: [AxiosHttpModule.register({
		timeout: 5 * 1000,
		maxRedirects: 5,
	})],
  exports: [AxiosHttpModule],
})
export class HttpModule extends AxiosHttpModule implements OnModuleInit {
  constructor(
    private readonly httpService: HttpService,
  ) {
    super();
  }

  public onModuleInit(): any {
    const axios = this.httpService.axiosRef;
    axios.interceptors.request.use((config) => {
			// @ts-ignore
			config.startTime = Date.now();
			return config;
		});
		axios.interceptors.response.use((config) => {
			console.log('request', config);
			// @ts-ignore
			config.startTime = Date.now();
			return config;
		});
  }
	
}
