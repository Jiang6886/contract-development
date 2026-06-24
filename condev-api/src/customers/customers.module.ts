import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersModule } from '../users/users.module'
import { Customer } from './customer.entity'
import { CustomersController } from './customers.controller'
import { CustomersService } from './customers.service'

@Module({
  imports: [TypeOrmModule.forFeature([Customer]), UsersModule],
  controllers: [CustomersController],
  providers: [CustomersService]
})
export class CustomersModule {}
