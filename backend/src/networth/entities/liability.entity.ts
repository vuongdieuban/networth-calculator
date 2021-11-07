import { AbstractEntity } from 'src/shared/abstract.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { moneyColumnOption } from './money-column-option';

@Entity()
export class LiabilityEntity extends AbstractEntity {
  @OneToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity;

  @Column({
    ...moneyColumnOption,
    name: 'credit_card_1',
  })
  creditCard1: number;

  @Column({
    ...moneyColumnOption,
    name: 'credit_card_1_monthly_payment',
    nullable: false,
    default: 200,
  })
  creditCard1MonthlyPayment: number;

  @Column({
    ...moneyColumnOption,
    name: 'credit_card_2',
  })
  creditCard2: number;

  @Column({
    ...moneyColumnOption,
    name: 'credit_card_2_monthly_payment',
    nullable: false,
    default: 150,
  })
  creditCard2MonthlyPayment: number;

  @Column({
    ...moneyColumnOption,
    name: 'mortgage_1',
  })
  mortgage1: number;

  @Column({
    ...moneyColumnOption,
    name: 'mortgage_1_monthly_payment',
    nullable: false,
    default: 2000,
  })
  mortgage1MonthlyPayment: number;

  @Column({
    ...moneyColumnOption,
    name: 'mortgage_2',
  })
  mortgage2: number;

  @Column({
    ...moneyColumnOption,
    name: 'mortgage_2_monthly_payment',
    nullable: false,
    default: 3500,
  })
  mortgage2MonthlyPayment: number;

  @Column({
    ...moneyColumnOption,
    name: 'line_of_credit',
  })
  lineOfCredit: number;

  @Column({
    ...moneyColumnOption,
    name: 'line_of_credit_monthly_payment',
    nullable: false,
    default: 500,
  })
  lineOfCreditMonthlyPayment: number;

  @Column({
    ...moneyColumnOption,
    name: 'investment_loan',
  })
  investmentLoan: number;

  @Column({
    ...moneyColumnOption,
    name: 'investment_loan_monthly_payment',
    nullable: false,
    default: 700,
  })
  investmentLoanMonthlyPayment: number;
}
