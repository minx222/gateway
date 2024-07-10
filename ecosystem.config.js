module.exports = {
	apps: [
		{
			name: 'front-gateway',
			script: 'build/index.js',
			instances: 'max',
			autorestart: true,
			watch: false,
			max_memory_restart: '1G',
			env: {
				RUNNING_ENV: 'prod',
				PORT: 3020,
			},
		},
	],
};
