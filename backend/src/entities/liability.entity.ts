import { Column, Entity } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { moneyColumnOption } from './money-column-option';

@Entity()
export class LiabilityEntity extends AbstractEntity {
  @Column({
    name: 'credit_card_1',
    ...moneyColumnOption,
  })
  creditCard1: number;

  @Column({
    name: 'credit_card_2',
    ...moneyColumnOption,
  })
  creditCard2: number;

  @Column({
    name: 'mortgage_1',
    ...moneyColumnOption,
  })
  mortgage1: number;

  @Column({
    name: 'mortgage_2',
    ...moneyColumnOption,
  })
  mortgage2: number;

  @Column({
    name: 'line_of_credit',
    ...moneyColumnOption,
  })
  lineOfCredit: number;

  @Column({
    name: 'investment_loan',
    ...moneyColumnOption,
  })
  investmentLoan: number;
}
