// Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
module.exports = {
  apps: [
    {
      name: 'front-gateway',
      script: 'dist/apps/front-gateway/main.js',
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
