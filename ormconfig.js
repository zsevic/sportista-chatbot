module.exports = [
  {
    name: 'migration',
    type: 'sqlite',
    database: 'database.sqlite',
    entities: ['dist/**/**.entity{.ts,.js}'],
    migrations: ['database/migrations/*{.ts,.js}'],
    migrationsTableName: 'migrations',
    cli: {
      migrationsDir: 'database/migrations',
    },
    logging: true,
    synchronize: false
  },
  {
    name: 'seed',
    type: 'sqlite',
    database: 'database.sqlite',
    entities: ['src/**/**.entity{.ts,.js}'],
    migrations: ['database/seeders/*{.ts,.js}'],
    migrationsTableName: 'seeders',
    cli: {
      migrationsDir: 'database/seeders',
    },
    logging: true,
    synchronize: false,
  },
];
