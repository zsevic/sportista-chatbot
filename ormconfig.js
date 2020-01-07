module.exports = [
  {
    name: 'default',
    type: 'sqlite',
    database: 'database.sqlite',
    entities: ['dist/**/**.entity{.ts,.js}'],
    migrations: ['dist/database/migrations/*{.ts,.js}'],
    logging: true,
    synchronize: false,
  },
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
    entities: ['dist/**/**.entity{.ts,.js}'],
    migrations: ['database/seeders/*{.ts,.js}'],
    migrationsTableName: 'seeders',
    cli: {
      migrationsDir: 'database/seeders',
    },
    logging: true,
    synchronize: false,
  },
  {
    name: 'test',
    type: 'sqlite',
    database: 'database.sqlite',
    entities: ['dist/**/**.entity{.ts,.js}'],
    migrations: ['database/migrations/*{.ts,.js}'],
    migrationsTableName: 'migrations',
    logging: false,
    synchronize: false,
  },
];