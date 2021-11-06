import { Exclude } from 'class-transformer';
import { Column, Entity } from 'typeorm';
import { AbstractEntity } from './abstract.entity';

@Entity()
export class UserEntity extends AbstractEntity {
  @Column({ unique: true, name: 'email' })
  email: string;

  @Exclude()
  @Column({ name: 'password', type: 'varchar', length: 64 })
  password: string;
}
