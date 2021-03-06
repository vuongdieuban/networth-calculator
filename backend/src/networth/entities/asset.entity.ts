import { Column, Entity, JoinColumn, OneToOne, Unique } from 'typeorm';
import { AbstractEntity } from '../../shared/entities/abstract.entity';
import { moneyColumnOption } from './money-column-option';
import { UserEntity } from '../../user/entities/user.entity';

@Entity()
@Unique(['userId'])
export class AssetEntity extends AbstractEntity {
  @Column({ name: 'user_id', type: 'text' })
  userId: string;

  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user?: UserEntity;

  @Column({
    ...moneyColumnOption,
    name: 'chequing',
  })
  chequing: number;

  @Column({
    ...moneyColumnOption,
    name: 'savings_for_taxes',
  })
  savingsForTaxes: number;

  @Column({
    ...moneyColumnOption,
    name: 'rainy_day_fund',
  })
  rainyDayFund: number;

  @Column({
    ...moneyColumnOption,
    name: 'savings_for_fun',
  })
  savingsForFun: number;

  @Column({
    ...moneyColumnOption,
    name: 'savings_for_travel',
  })
  savingsForTravel: number;

  @Column({
    ...moneyColumnOption,
    name: 'savings_for_personal_development',
  })
  savingsForPersonalDevelopment: number;

  @Column({
    ...moneyColumnOption,
    name: 'investment_1',
  })
  investment1: number;

  @Column({
    ...moneyColumnOption,
    name: 'investment_2',
  })
  investment2: number;

  @Column({
    ...moneyColumnOption,
    name: 'investment_3',
  })
  investment3: number;

  @Column({
    ...moneyColumnOption,
    name: 'primary_home',
  })
  primaryHome: number;

  @Column({
    ...moneyColumnOption,
    name: 'secondary_home',
  })
  secondaryHome: number;

  @Column({
    ...moneyColumnOption,
    name: 'other',
  })
  other: number;
}
