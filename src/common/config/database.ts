import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  type: 'sqlite',
  database: 'database.sqlite',
  entities: ['dist/**/**.entity{.ts,.js}'],
  migrations: ['dist/database/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations',
  logging: false,
  synchronize: true,
  keepConnectionAlive: true,
}));
