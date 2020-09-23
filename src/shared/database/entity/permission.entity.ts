import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

  @Column({ length: 100, unique: true })
  name: string;

  @Column({ length: 100, name: 'display_name' })
  displayName: string;

  @Column({ length: 100, name: 'group_name', nullable: true })
  groupName: string;

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

    return;
  }

  @BeforeUpdate()
  beforeUpdate(): null {
    this.updatedAt = new Date();

    return;
  }
}
