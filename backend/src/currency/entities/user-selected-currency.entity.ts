import { AbstractEntity } from 'src/shared/entities/abstract.entity';
import { CurrencyType } from 'src/currency/constants/currency-type.enum';
import { UserEntity } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, OneToOne, Unique } from 'typeorm';

@Entity()
@Unique(['userId'])
export class UserSelectedCurrencyEntity extends AbstractEntity {
  @Column({
    name: 'currency',
    type: 'enum',
    nullable: false,
    default: CurrencyType.CAD,
    enum: CurrencyType,
  })
  currency: CurrencyType;

  @Column({ name: 'user_id', type: 'text' })
  userId: string;

  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user?: UserEntity;
}
