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
import { UserProfile } from './user_profile.entity';
import { UserMedicalData } from './user_medical_data.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id?: number;

  @ApiProperty()
  @Column({ length: 100, unique: true })
  email: string;

  @ApiProperty()
  @Column({ length: 50 })
  username: string;

  @ApiProperty()
  @Column({ length: 191 })
  password: string;

  @ApiProperty()
  @Column({ length: 191, nullable: true })
  avatar?: string;

  @ApiProperty()
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
    () => UserProfile,
    profile => profile.user,
    {
      eager: true,
      cascade: true,
    },
  )
  profile: UserProfile;

  @OneToOne(
    () => UserMedicalData,
    medic => medic.user,
    {
      eager: true,
      cascade: true,
    },
  )
  medicalHistory: UserMedicalData;

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
