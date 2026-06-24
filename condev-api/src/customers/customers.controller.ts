import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { CurrentUser } from '../auth/current-user.decorator'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { JwtPayload } from '../auth/types/jwt-payload.type'
import { CustomersService } from './customers.service'
import { CreateCustomerDto } from './dto/create-customer.dto'
import { UpdateCustomerDto } from './dto/update-customer.dto'
import { CustomerSearchField } from './types/customer-search-field.type'

@Controller('customers')
@UseGuards(JwtAuthGuard)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('searchField') searchField?: CustomerSearchField,
    @Query('keyword') keyword?: string
  ) {
    return this.customersService.findAll({
      page: Number(page || 1),
      limit: Number(limit || 10),
      searchField,
      keyword
    })
  }

  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto, @CurrentUser() user: JwtPayload) {
    return this.customersService.create(createCustomerDto, user.sub)
  }

  @Get('postal-code/search')
  findAddressByPostalCode(@Query('postalCode') postalCode = '') {
    return this.customersService.findAddressByPostalCode(postalCode)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(id)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
    @CurrentUser() user: JwtPayload
  ) {
    return this.customersService.update(id, updateCustomerDto, user.sub)
  }
}
