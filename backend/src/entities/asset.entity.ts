import { Column, Entity } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { moneyColumnOption } from './money-column-option';

@Entity()
export class AssetEntity extends AbstractEntity {
  @Column({
    name: 'chequing',
    ...moneyColumnOption,
  })
  chequing: number;

  @Column({
    name: 'savings_for_taxes',
    ...moneyColumnOption,
  })
  savingsForTaxes: number;

  @Column({
    name: 'rainy_day_fund',
    ...moneyColumnOption,
  })
  rainyDayFund: number;

  @Column({
    name: 'savings_for_fun',
    ...moneyColumnOption,
  })
  savingsForFun: number;

  @Column({
    name: 'savings_for_travel',
    ...moneyColumnOption,
  })
  savingsForTravel: number;

  @Column({
    name: 'savings_for_personal_development',
    ...moneyColumnOption,
  })
  savingsForPersonalDevelopment: number;

  @Column({
    name: 'investment_1',
    ...moneyColumnOption,
  })
  investment1: number;

  @Column({
    name: 'investment_2',
    ...moneyColumnOption,
  })
  investment2: number;

  @Column({
    name: 'investment_3',
    ...moneyColumnOption,
  })
  investment3: number;

  @Column({
    name: 'primary_home',
    ...moneyColumnOption,
  })
  primaryHome: number;

  @Column({
    name: 'secondary_home',
    ...moneyColumnOption,
  })
  secondaryHome: number;

  @Column({
    name: 'other',
    ...moneyColumnOption,
  })
  other: number;
}
