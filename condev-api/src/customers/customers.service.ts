import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UsersService } from '../users/users.service'
import { Customer } from './customer.entity'
import { CreateCustomerDto } from './dto/create-customer.dto'
import { UpdateCustomerDto } from './dto/update-customer.dto'
import { CustomerSearchField } from './types/customer-search-field.type'

type FindCustomersParams = {
  page: number
  limit: number
  searchField?: CustomerSearchField
  keyword?: string
}

type ZipCloudResponse = {
  status: number
  message: string | null
  results: Array<{
    address1: string
    address2: string
    address3: string
    kana1: string
    kana2: string
    kana3: string
    prefcode: string
    zipcode: string
  }> | null
}

const searchColumnMap: Record<CustomerSearchField, string> = {
  companyName: 'customer.companyName',
  representativeName: 'customer.representativeName',
  address: 'customer.address',
  phoneNumber: 'customer.phoneNumber'
}

const formatCustomerIdDate = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}${month}${day}`
}

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customersRepository: Repository<Customer>,
    private readonly usersService: UsersService
  ) {}

  async findAll(params: FindCustomersParams) {
    const limit = Number.isFinite(params.limit)
      ? Math.min(Math.max(Math.trunc(params.limit), 1), 100)
      : 10
    const page = Number.isFinite(params.page) ? Math.max(Math.trunc(params.page), 1) : 1
    const keyword = params.keyword?.trim()

    const query = this.customersRepository
      .createQueryBuilder('customer')
      .orderBy('customer.registeredAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

    if (keyword && params.searchField && searchColumnMap[params.searchField]) {
      query.where(`${searchColumnMap[params.searchField]} LIKE :keyword`, {
        keyword: `%${keyword}%`
      })
    }

    const [items, total] = await query.getManyAndCount()
    const lastPage = Math.max(Math.ceil(total / limit), 1)

    return {
      items,
      total,
      page,
      limit,
      lastPage
    }
  }

  async findOne(id: string) {
    const customer = await this.customersRepository.findOne({
      where: { id }
    })

    if (!customer) {
      throw new NotFoundException('顧客情報が見つかりません。')
    }

    return customer
  }

  async findAddressByPostalCode(postalCode: string) {
    const normalizedPostalCode = postalCode.replace(/\D/g, '')

    if (normalizedPostalCode.length !== 7) {
      return {
        postalCode,
        address: null
      }
    }

    const response = await fetch(
      `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${normalizedPostalCode}`
    )
    const data = (await response.json()) as ZipCloudResponse
    const result = data.results?.[0]

    if (!result) {
      return {
        postalCode,
        address: null
      }
    }

    return {
      postalCode: result.zipcode.replace(/^(\d{3})(\d{4})$/, '$1-$2'),
      address: `${result.address1}${result.address2}${result.address3}`
    }
  }

  async create(createCustomerDto: CreateCustomerDto, currentUserId: string) {
    const user = await this.usersService.findById(currentUserId)

    if (!user) {
      throw new NotFoundException('ユーザー情報が見つかりません。')
    }

    const customerId = await this.generateCustomerId()
    const customer = this.customersRepository.create({
      id: customerId,
      companyName: createCustomerDto.companyName,
      companyNameKana: createCustomerDto.companyNameKana || null,
      representativeName: createCustomerDto.representativeName,
      postalCode: createCustomerDto.postalCode || null,
      address: createCustomerDto.address,
      buildingName: createCustomerDto.buildingName || null,
      phoneNumber: createCustomerDto.phoneNumber,
      faxNumber: createCustomerDto.faxNumber || null,
      siteUrl: createCustomerDto.siteUrl || null,
      importance: createCustomerDto.importance || null,
      contractConclusionDate: createCustomerDto.contractConclusionDate || null,
      primarySales: createCustomerDto.primarySales || null,
      secondarySales: createCustomerDto.secondarySales || null,
      remarks: createCustomerDto.remarks || null,
      registeredBy: user.userName,
      updatedBy: user.userName
    })

    return this.customersRepository.save(customer)
  }

  private async generateCustomerId() {
    const prefix = `CUS-${formatCustomerIdDate(new Date())}-`
    const latestCustomer = await this.customersRepository
      .createQueryBuilder('customer')
      .where('customer.id LIKE :prefix', { prefix: `${prefix}%` })
      .orderBy('customer.id', 'DESC')
      .getOne()

    const latestSequence = latestCustomer
      ? Number(latestCustomer.id.replace(prefix, ''))
      : 0
    const nextSequence = String(latestSequence + 1).padStart(4, '0')

    return `${prefix}${nextSequence}`
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto, updatedByUserId: string) {
    const customer = await this.findOne(id)
    const user = await this.usersService.findById(updatedByUserId)

    if (!user) {
      throw new NotFoundException('ユーザー情報が見つかりません。')
    }

    Object.assign(customer, {
      companyName: updateCustomerDto.companyName,
      companyNameKana: updateCustomerDto.companyNameKana || null,
      representativeName: updateCustomerDto.representativeName,
      postalCode: updateCustomerDto.postalCode || null,
      address: updateCustomerDto.address,
      buildingName: updateCustomerDto.buildingName || null,
      phoneNumber: updateCustomerDto.phoneNumber,
      faxNumber: updateCustomerDto.faxNumber || null,
      siteUrl: updateCustomerDto.siteUrl || null,
      importance: updateCustomerDto.importance || null,
      contractConclusionDate: updateCustomerDto.contractConclusionDate || null,
      primarySales: updateCustomerDto.primarySales || null,
      secondarySales: updateCustomerDto.secondarySales || null,
      remarks: updateCustomerDto.remarks || null,
      updatedBy: user.userName
    })

    return this.customersRepository.save(customer)
  }
}
