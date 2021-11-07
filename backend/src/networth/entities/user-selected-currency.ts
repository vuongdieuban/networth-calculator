import { AbstractEntity } from 'src/shared/abstract.entity';
import { CurrencyType } from 'src/shared/constants/currency-type.enum';
import { UserEntity } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

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
