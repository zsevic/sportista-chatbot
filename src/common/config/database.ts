import { registerAs } from '@nestjs/config';

export default registerAs('database', () => {
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

  const environmentsConfig = {
    production: {
      ...options,
      migrationsRun: true,
      ssl: {
        rejectUnauthorized: false,
      },
      type: 'postgres',
      url: process.env.DATABASE_URL,
    },
    development: {
      ...options,
      type: 'postgres',
      url: process.env.DATABASE_URL,
    },
    test: {
      ...options,
      type: 'sqlite',
      database: 'database.sqlite',
      entities: ['src/**/*.entity.ts'],
      synchronize: true,
    },
  };
  const currentEnvironment = process.env.NODE_ENV || 'development';

  return environmentsConfig[currentEnvironment];
});
