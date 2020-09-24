import {
  Entity,
  Column,
  JoinColumn,
  BeforeInsert,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BeforeUpdate,
  BeforeRemove,
  OneToOne,
} from 'typeorm';
import { User } from './user.entity';

@Entity('user_profiles')
export class UserProfile {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id?: number;

  @OneToOne(
    () => User,
    user => user.id,
    {
      eager: false,
    },
  )
  @JoinColumn({ name: 'user_id' })
  user: User | number;

  @Column({ length: 100, name: 'first_name' })
  firstName: string;

  @Column({ length: 100, name: 'last_name' })
  lastName: string;

  @Column({ length: 50 })
  phone: string;

  @Column({ type: 'text', nullable: true })
  biography?: string;

  @Column({ name: 'last_treated_ailment', type: 'text', nullable: true })
  lastTreatedAilment?: string;

  @Column({ name: 'is_anonymous', type: 'tinyint', default: 0 })
  isAnonymous?: number;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  createdAt?: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
  })
  updatedAt?: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
  })
  deletedAt?: Date;

  @BeforeInsert()
  beforeCreate(): null {
    this.createdAt = new Date();
    this.updatedAt = this.createdAt;
    return null;
  }

  @BeforeUpdate()
  beforeUpdate(): null {
    this.updatedAt = new Date();
    return null;
  }

  @BeforeRemove()
  beforeDestroy(): null {
    this.deletedAt = new Date();

    return;
  }
}
