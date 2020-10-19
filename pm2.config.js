module.exports = {
  apps: [
    {
      name: 'app',
      script: 'dist/src/main.js',
      instances: 'max',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
        NODE_PATH: './dist/src',
        TZ: 'UTC',
      },
      exec_mode: 'cluster',
    },
  ],
};
