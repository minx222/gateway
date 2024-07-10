import { TypeORMProperties } from './properties';

export class MongoDBProperties extends TypeORMProperties {
	readonly configPrefix = 'nest.datasource.mongodb';

	constructor() {
		super();
		super.init();
	}
}
