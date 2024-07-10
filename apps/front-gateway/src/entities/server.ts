import { Column, ObjectIdColumn } from 'typeorm';
import { ObjectId } from 'typeorm';

export class ProxyServer {
	/**
	 * AppId
	 */
	@ObjectIdColumn({
		name: '_id',
	})
	appId: ObjectId;

	/**
	 * 服务器地址
	 */
	@Column()
	serverUrl: string;

	/**
	 * 代理类型
	 */
	@Column()
	proxyType: string;

	static Type: string;

	constructor(appId: ObjectId, serverUrl: string, proxyType: string) {
		this.appId = appId;
		this.serverUrl = serverUrl;
		this.proxyType = proxyType;
	}
}
