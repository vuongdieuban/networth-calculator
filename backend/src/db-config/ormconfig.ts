import { join } from 'path';
import { RefreshTokenEntity } from 'src/auth/entities/refresh-token.entity';
import { AssetEntity } from 'src/networth/entities/asset.entity';
import { LiabilityEntity } from 'src/networth/entities/liability.entity';
import { UserSelectedCurrencyEntity } from 'src/networth/entities/user-selected-currency.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { ConnectionOptions } from 'typeorm';

export const ormconfig: ConnectionOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'demo',
  entities: [
    UserEntity,
    RefreshTokenEntity,
    AssetEntity,
    LiabilityEntity,
    UserSelectedCurrencyEntity,
  ],

  migrationsTableName: 'migration',
  migrations: ['dist/migrations/*.js'],
  cli: {
    migrationsDir: 'src/migrations',
  },
  synchronize: false,
  dropSchema: false,
  migrationsRun: true,
  logging: ['schema', 'query', 'error'],
};
