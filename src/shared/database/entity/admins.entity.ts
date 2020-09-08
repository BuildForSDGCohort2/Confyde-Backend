import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  BeforeInsert,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BeforeUpdate,
  BeforeRemove,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from './role.entity';

@Entity('admins')
export class Admin {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id?: number;

  @Column({ length: 100, name: 'first_name' })
  firstName: string;

  @Column({ length: 100, name: 'last_name' })
  lastName: string;

  @Column({ length: 100, unique: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  avatar?: string;

  @Column({ length: 191 })
  password: string;

  @Column({ type: 'tinyint', default: 1 })
  status: number;

  @ManyToOne(() => Role, { eager: false, cascade: true })
  @JoinColumn({ name: 'role_id' })
  role: Role | number;

  @ManyToMany(() => Role, { eager: true, cascade: true })
  @JoinTable({
    name: 'admin_roles', // table name for the junction table of this relation
    joinColumn: {
      name: 'admin_id',
    },
    inverseJoinColumn: {
      name: 'role_id',
    },
  })
  roles: Role[] | number[];

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
  async beforeCreate() {
    this.createdAt = new Date();
    this.updatedAt = this.createdAt;
    await this.hashPassword();
  }

  @BeforeUpdate()
  async beforeUpdate() {
    this.updatedAt = new Date();
    await this.hashPassword();
  }

  @BeforeRemove()
  beforeDestroy() {
    this.deletedAt = new Date();
  }

  // @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
}
