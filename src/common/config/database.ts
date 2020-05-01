import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  database: 'database.sqlite',
  entities: ['dist/**/**.entity{.ts,.js}'],
  keepConnectionAlive: true,
  logging: false,
  migrations: ['dist/database/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations',
  synchronize: false,
  type: 'sqlite',
}));
