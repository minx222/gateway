import { Config } from '@app/common';

export class TypeORMProperties {
	readonly configPrefix: string;
	url: string;
	type: 'mysql' | 'mariadb' | 'mongodb';
	port: number;
	username: string;
	password: string;
	database: string;
	entities: string;

	constructor() {}

	init() {
		const config = new Config();
		const { url, type, port, username, password, database, entities } = config.get<TypeORMProperties>(this.configPrefix);
		this.url = url;
		this.type = type;
		this.port = port;
		this.username = username;
		this.password = password;
		this.database = database;
		this.entities = entities;
	}
}
