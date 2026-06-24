import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ name: 'company_name', length: 120 })
  companyName!: string

  @Column({ name: 'user_name', length: 80 })
  userName!: string

  @Column({ unique: true, length: 255 })
  email!: string

  @Column({ name: 'password_hash', length: 255 })
  passwordHash!: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date
}
