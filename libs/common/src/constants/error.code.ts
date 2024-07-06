export enum BUSINESS_ERROR_CODE {
	// 公共错误码
	COMMON = 500,

	// 特殊错误码
	TOKEN_INVALID = 10002,

	// 禁止访问
	ACCESS_FORBIDDEN = 401,

	// 权限已禁用
	PERMISSION_DISABLED = 403,

	// 用户已冻结
	USER_DISABLED = 405,

	// 用户已冻结
	APP_DISABLED = 10004,
}
