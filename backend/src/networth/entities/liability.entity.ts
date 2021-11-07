import { AbstractEntity } from 'src/shared/entities/abstract.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, OneToOne, Unique } from 'typeorm';
import { moneyColumnOption } from './money-column-option';

@Entity()
@Unique(['userId'])
export class LiabilityEntity extends AbstractEntity {
  @Column({ name: 'user_id', type: 'text' })
  userId: string;

  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user?: UserEntity;

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
