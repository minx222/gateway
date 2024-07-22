import { Entity, Column } from 'typeorm';
import { ProxyServer } from './server';
import { ObjectId } from 'typeorm';

@Entity('server')
export class OauthServer extends ProxyServer {
	static Type: string = 'Oauth';
	/**
	 * 应用CAS网关的URL
	 */
	@Column()
	casUrl: string;

	/**
	 * CAS版本信息
	 */
	@Column()
	casVersion: string;

	/**
	 * 服务器代码
	 */
	@Column()
	serverCode: string;

	/**
	 * 客户端ID
	 */
	@Column()
	clientId: string;

	/**
	 * 客户端密钥
	 */
	@Column()
	clientSecret: string;

	/**
	 * 客户端密钥
	 */
	@Column()
	tokenServer: string;

	/**
	 * Cookie名称
	 */
	@Column()
	cookieName: string;

	constructor(
		appId: ObjectId,
		casUrl: string,
		serverUrl: string,
		casVersion: string,
		serverCode: string,
		clientId: string,
		cookieName: string,
	) {
		super(appId, serverUrl, 'Oauth');
		this.casUrl = casUrl;
		this.casVersion = casVersion;
		this.serverCode = serverCode;
		this.clientId = clientId;
		this.cookieName = cookieName;
	}
}
