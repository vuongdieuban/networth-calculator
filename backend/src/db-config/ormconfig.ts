import { join } from 'path';
import { ConnectionOptions } from 'typeorm';

export const ormconfig: ConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'demo',
  entities: [
    join(__dirname, '**', '*.entity.{ts,js}'),
    './dist/**/*.entity.{ts,js}',
  ],

  migrationsTableName: 'migration',
  migrations: ['dist/migrations/*.js'],
  cli: {
    migrationsDir: 'src/migrations',
  },
  synchronize: process.env.NODE_ENV === 'development', // false in prod
  dropSchema: process.env.NODE_ENV === 'development', // false in prod
  migrationsRun: true,
  logging: ['schema', 'query', 'error'],
};
