import {
  BaseEntity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class AbstractEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({
    name: 'created_ts',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdTs: Date;

  @UpdateDateColumn({
    name: 'updated_ts',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedTs: Date;
}
