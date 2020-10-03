import { ApiProperty } from '@nestjs/swagger';
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
      onDelete: 'CASCADE',
      onUpdate: 'NO ACTION'
    },
  )
  @JoinColumn({ name: 'user_id' })
  user: User | number;

  @ApiProperty()
  @Column({ length: 100, name: 'first_name' })
  firstName: string;

  @ApiProperty()
  @Column({ length: 100, name: 'last_name' })
  lastName: string;

  @ApiProperty()
  @Column({ length: 50 })
  phone: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  biography?: string;

  @ApiProperty()
  @Column({ name: 'last_treated_ailment', type: 'text', nullable: true })
  lastTreatedAilment?: string;

  @ApiProperty()
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
