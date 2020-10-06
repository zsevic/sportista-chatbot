require('dotenv/config');

const options = {
  name: 'migrations',
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: ['dist/**/*.entity.js'],
  migrationsTableName: 'migrations',
  cli: {
    migrationsDir: 'database/migrations',
  },
  synchronize: false,
};

module.exports = [{
    ...options,
    name: 'default',
    logging: false,
    migrations: ['database/migrations/*.js'],
  }, {
    ...options,
    name: 'migrations',
    logging: true,
    migrations: ['database/migrations/*.ts'],
  },
];
