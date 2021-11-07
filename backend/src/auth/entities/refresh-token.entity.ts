import { AbstractEntity } from 'src/shared/abstract.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class RefreshTokenEntity extends AbstractEntity {
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ default: false, name: 'invalidated' })
  invalidated: boolean;

  @Column({ name: 'expiry_date' })
  expiryDate: Date;
}
