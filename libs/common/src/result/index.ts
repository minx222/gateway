export class Result<T = any> {
	code: number;
	data: T;
	message: string;

	constructor(code: number, data: T, message: string) {
		this.code = code;
		this.data = data;
		this.message = message;
	}

	static success<T>(data: T, message: string = 'success'): Result<T> {
		return new Result<T>(200, data, message);
	}

	static error<T>(message: string = '服务端异常'): Result<T> {
		return new Result<T>(500, null, message);
	}

	static errorCode<T>(code: number, message: string = '服务端异常'): Result<T> {
		return new Result<T>(code, null, message);
	}

	static errorData<T>(data: T, message: string = '服务端异常'): Result<T> {
		return new Result<T>(500, data, message);
	}
}
