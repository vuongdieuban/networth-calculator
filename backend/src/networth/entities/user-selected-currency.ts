import { CurrencyType } from 'src/constants/currency-type.enum';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { UserEntity } from './user.entity';

@Entity()
export class UserSelectedCurrency extends AbstractEntity {
  @Column({
    name: 'currency',
    type: 'enum',
    nullable: false,
    default: CurrencyType.CAD,
    enum: CurrencyType,
  })
  currency: CurrencyType;

  @OneToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity;
}
