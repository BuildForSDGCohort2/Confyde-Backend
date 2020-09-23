import {
  Entity,
  Column,
  ManyToMany,
  JoinTable,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Permission } from './permission.entity';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

  @Column({ length: 100, unique: true })
  name: string;

  @Column({ length: 100, name: 'display_name' })
  displayName: string;

  @ManyToMany(() => Permission, { eager: true, cascade: true })
  @JoinTable({
    name: 'role_permissions', // table name for the junction table of this relation
    joinColumn: {
      name: 'role_id',
    },
    inverseJoinColumn: {
      name: 'permission_id',
    },
  })
  permissions: Permission[];

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
  })
  updatedAt: Date;

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
}
