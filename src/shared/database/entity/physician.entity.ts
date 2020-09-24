import { PhysicianProfile } from './physician_profile.entity';
import {
  Entity,
  Column,
  BeforeInsert,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BeforeUpdate,
  BeforeRemove,
  OneToOne,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity('physicians')
export class Physician {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id?: number;

  @Column({ length: 100, unique: true })
  email: string;

  @Column({ length: 50, unique: true })
  username: string;

  @Column({ length: 191 })
  password: string;

  @Column({ length: 191, nullable: true })
  avatar?: string;

  @Column({ type: 'tinyint', default: 1 })
  status: number;

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

  @OneToOne(
    () => PhysicianProfile,
    profile => profile.physician,
    {
      eager: true,
      cascade: true,
    },
  )
  profile: PhysicianProfile;

  @BeforeInsert()
  async beforeCreate(): Promise<null> {
    this.createdAt = new Date();
    this.updatedAt = this.createdAt;
    await this.hashPassword();

    return;
  }

  @BeforeUpdate()
  async beforeUpdate(): Promise<null> {
    this.updatedAt = new Date();
    await this.hashPassword();

    return;
  }

  @BeforeRemove()
  beforeDestroy(): null {
    this.deletedAt = new Date();

    return;
  }

  // @BeforeInsert()
  async hashPassword(): Promise<null> {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }

    return;
  }
}
