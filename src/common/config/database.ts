import { registerAs } from '@nestjs/config';

const options = {
  cli: {
    migrationsDir: 'database/migrations',
  },
  entities: ['dist/**/*.entity.js'],
  keepConnectionAlive: true,
  logging: false,
  migrations: ['database/migrations/*.js'],
  migrationsTableName: 'migrations',
  synchronize: false,
};

export default registerAs('database', () => {
  const environmentsConfig = {
    production: {
      ...options,
      type: 'postgres',
      url: process.env.DATABASE_URL,
    },
    development: {
      ...options,
      type: 'postgres',
      url: process.env.DATABASE_URL,
    },
  };
  const currentEnvironment = process.env.NODE_ENV || 'development';

  return environmentsConfig[currentEnvironment];
});
