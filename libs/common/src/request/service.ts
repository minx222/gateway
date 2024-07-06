import { HttpService as AxiosService } from "@nestjs/axios";
import { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { Observable } from "rxjs";

export class HttpService extends AxiosService {
  constructor() {
    super();
		this.axiosRef.interceptors.request.use((config: InternalAxiosRequestConfig & {
			startTime?: number
			retry?: number
			maxRetry?: number
		}) => {
			if (!config.startTime) {
				config.startTime = Date.now();
			}
			config.retry = config.retry ? config.retry + 1 : 1;
			config.timeout
			return config;
		})
  }
}
