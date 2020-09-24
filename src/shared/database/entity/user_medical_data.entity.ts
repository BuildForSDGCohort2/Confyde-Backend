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

@Entity('user_medical_data')
export class UserMedicalData {
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

  @Column({ length: 50, name: 'blood_group' })
  bloodGroup: string;

  @Column({ length: 50, name: 'genotype' })
  genotype: string;

  @Column({ name: 'is_allergic', type: 'tinyint', default: 0 })
  isAllergic?: number;

  @Column({ type: 'text', nullable: true })
  allerygy?: string;

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
