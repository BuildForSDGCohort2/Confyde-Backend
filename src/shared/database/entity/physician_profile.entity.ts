import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';
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
import { Physician } from './physician.entity';

@Entity('physician_profiles')
export class PhysicianProfile {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id?: number;

  @OneToOne(
    () => Physician,
    physician => physician.id,
    {
      eager: false,
    },
  )
  @JoinColumn({ name: 'physician_id' })
  physician: Physician | number;

  @ApiProperty({ description: 'First name'})
  @IsNotEmpty({message: 'First name is required'})
  @Column({ length: 100, name: 'first_name' })
  firstName: string;

  @ApiProperty({ description: 'Last name'})
  @IsNotEmpty({message: 'Last name is required'})
  @Column({ length: 100, name: 'last_name' })
  lastName: string;

  @ApiProperty({ description: 'Phone number'})
  @IsNotEmpty({message: 'Phone number is required'})
  @MaxLength(50, {message: 'Phone number is too long'})
  @Column({ length: 50 })
  phone: string;

  @ApiProperty({ description: 'Physician\'s specialty, e.g DERMATOLOGY, OBSTETRICS AND GYNECOLOGY etc'})
  @Column({ type: 'text', nullable: true })
  specialty?: string;

  @ApiProperty({ description: 'Employer can be Private Practise or State/Federal Government'})
  @Column({ type: 'text', nullable: true })
  employer?: string;

  @ApiProperty({ description: 'Current Hospital of practise'})
  @Column({ type: 'text', nullable: true })
  hospital?: string;

  @ApiProperty({ description: 'Tell us about yourself'})
  @Column({ type: 'text', nullable: true })
  biography?: string;

  @ApiProperty({ description: 'Are you licensed?'})
  @Column({ type: 'tinyint', default: 0 })
  licensed?: number;

  @ApiProperty({ description: 'License issuance date'})
  @Column({ name: 'license_issue_date', type: 'date', nullable: true })
  licenseIssueDate: Date;

  @ApiProperty({ description: 'License expiry date'})
  @Column({ name: 'validity_date', type: 'date', nullable: true })
  validityDate: Date;

  @ApiProperty({ description: '(Internal use) Specify if license has been verified'})
  @Column({ name: 'license_verified', type: 'tinyint', default: 0 })
  licenseVerified: number;

  @Column({ name: 'verified_by', nullable: true })
  verifiedBy: string;

  @ApiProperty({ description: 'Default public post mode'})
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
