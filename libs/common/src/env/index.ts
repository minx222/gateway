import { parse } from 'yaml';
import * as path from 'path';
import * as fs from 'fs';

import { get } from 'radash';

import { singletonProxy } from '../utils';

let config: Record<string, any>;
// 获取项目运行环境
export const getEnv = () => {
	return process.env.RUNNING_ENV;
};

// 读取项目配置
export const getConfig = (): Record<string, any> => {
	if (config) {
		return config;
	}
	const environment = process.env.RUNNING_ENV;
	const yamlPath = path.join(process.cwd(), `./config/${environment}.yml`);
	const file = fs.readFileSync(yamlPath, 'utf8');
	config = parse(file);
	return config;
};

export class Properties {
	private readonly config: Record<string, any>;

	constructor() {
		this.config = getConfig();
	}

	get<T>(key: string) {
		return get<T>(this.config, key);
	}
}

export const Config = singletonProxy(Properties);
