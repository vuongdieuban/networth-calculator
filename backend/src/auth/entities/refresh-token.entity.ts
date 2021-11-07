import { AbstractEntity } from 'src/shared/entities/abstract.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class RefreshTokenEntity extends AbstractEntity {
  @Column({ name: 'user_id', type: 'text' })
  userId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user?: UserEntity;

  @Column({ default: false, name: 'invalidated' })
  invalidated: boolean;

  @Column({ name: 'expiry_date' })
  expiryDate: Date;
}
