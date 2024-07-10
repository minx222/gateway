/**
 * lint-staged 校验暂存区的文件
 */
module.exports = {
	'./apps/**/*.{js,ts,tsx,jsx}': [
		'eslint . --fix',
	],
	'./libs/**/*.{js,ts,tsx,jsx}': [
		'eslint . --fix',
	],
};
