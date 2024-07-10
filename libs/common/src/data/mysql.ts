import { TypeORMProperties } from './properties';

export class MysqlProperties extends TypeORMProperties {
	readonly configPrefix = 'nest.datasource.mysql';

	constructor() {
		super();
		super.init();
	}
}
