export class RequestOptions {
	url: string
	method: string
	headers: Record<string, string>
	body: any
	constructor(url: string, method: string, headers: Record<string, string>, body: any) {
		this.url = url
		this.method = method
		this.headers = headers
		this.body = body
	}
}
