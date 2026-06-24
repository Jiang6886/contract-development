import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity('m_customers')
export class Customer {
  @PrimaryColumn({ length: 36 })
  id!: string

  @Column({ name: 'company_name', length: 160 })
  companyName!: string

  @Column({ name: 'company_name_kana', type: 'varchar', length: 160, nullable: true })
  companyNameKana!: string | null

  @Column({ name: 'representative_name', length: 80 })
  representativeName!: string

  @Column({ name: 'postal_code', type: 'varchar', length: 10, nullable: true })
  postalCode!: string | null

  @Column({ length: 255 })
  address!: string

  @Column({ name: 'building_name', type: 'varchar', length: 120, nullable: true })
  buildingName!: string | null

  @Column({ name: 'phone_number', length: 30 })
  phoneNumber!: string

  @Column({ name: 'fax_number', type: 'varchar', length: 30, nullable: true })
  faxNumber!: string | null

  @Column({ name: 'site_url', type: 'varchar', length: 255, nullable: true })
  siteUrl!: string | null

  @Column({ type: 'varchar', length: 20, nullable: true })
  importance!: string | null

  @Column({ name: 'contract_conclusion_date', type: 'date', nullable: true })
  contractConclusionDate!: string | null

  @Column({ name: 'primary_sales', type: 'varchar', length: 80, nullable: true })
  primarySales!: string | null

  @Column({ name: 'secondary_sales', type: 'varchar', length: 80, nullable: true })
  secondarySales!: string | null

  @Column({ type: 'text', nullable: true })
  remarks!: string | null

  @CreateDateColumn({ name: 'registered_at' })
  registeredAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date

  @Column({ name: 'registered_by', length: 80 })
  registeredBy!: string

  @Column({ name: 'updated_by', length: 80 })
  updatedBy!: string
}
