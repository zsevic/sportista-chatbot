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
      },
      exec_mode: 'cluster',
    },
  ],
};
