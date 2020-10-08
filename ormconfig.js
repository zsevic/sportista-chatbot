require('dotenv/config');

module.exports = [
  {
    name: 'migrations',
    cli: {
      migrationsDir: 'database/migrations',
    },
    entities: ['dist/**/*.entity.js'],
    logging: true,
    migrations: ['database/migrations/*.ts'],
    migrationsTableName: 'migrations',
    synchronize: false,
    type: 'postgres',
    url: process.env.DATABASE_URL,
  },
];
