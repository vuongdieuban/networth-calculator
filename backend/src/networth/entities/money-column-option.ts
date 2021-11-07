import { ColumnOptions } from 'typeorm';
import { numberTransformer } from './number-transformer';

export const moneyColumnOption: Partial<ColumnOptions> = {
  type: 'numeric',
  precision: 14,
  scale: 2,
  transformer: numberTransformer,
  nullable: false,
  default: 0,
};
