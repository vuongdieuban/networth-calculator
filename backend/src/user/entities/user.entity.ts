import { Exclude } from 'class-transformer';
import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../../shared/abstract.entity';

@Entity()
export class UserEntity extends AbstractEntity {
  @Column({ unique: true, name: 'username', type: 'varchar', length: 32 })
  username: string;

  @Exclude()
  @Column({ name: 'hashed_password', type: 'varchar', length: 256 })
  hashedPassword: string;
}
