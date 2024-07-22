import { Config } from '@libs/common';

export class RedisProperties {
	prefix = 'nest.datasource.redis';
	host: string;
	port: number;
	password: string;
	db: number;
	keyPrefix: string;
	name: string;
	constructor() {
		const config = new Config();
		const { host, port, password, db, keyPrefix, name } = config.get<RedisProperties>(this.prefix);
		this.host = host;
		this.port = port;
		this.password = password;
		this.db = db;
		this.keyPrefix = keyPrefix;
		this.name = name ?? 'gateway';
	}
}
