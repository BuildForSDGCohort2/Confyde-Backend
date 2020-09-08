import { Entity, Column, ManyToMany, JoinTable, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { Permissions } from './permission.entity';

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

  @ManyToMany(() => Permissions, { eager: true, cascade: true })
  @JoinTable({
    name: 'role_permissions', // table name for the junction table of this relation
    joinColumn: {
      name: 'role_id',
    },
    inverseJoinColumn: {
      name: 'permission_id',
    },
  })
  permissions: Permissions[];

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
  beforeCreate() {
    this.createdAt = new Date();
    this.updatedAt = this.createdAt;
  }

  @BeforeUpdate()
  beforeUpdate() {
    this.updatedAt = new Date();
  }
}
