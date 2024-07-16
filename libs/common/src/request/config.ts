/**
 * 熔断配置
 */
export const options = {
	timeout: 3000, // 如果请求超过3秒，则视为失败
	errorThresholdPercentage: 50, // 错误率达到50%时，断路器打开
	resetTimeout: 30000, // 30秒后，尝试半开状态下的恢复
};

export const AXIOS_INSTANCE_TOKEN = 'AXIOS_INSTANCE_TOKEN';
