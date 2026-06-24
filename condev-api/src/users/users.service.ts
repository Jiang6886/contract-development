import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateUserInput } from './create-user.input'
import { User } from './user.entity'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) {}

  findById(id: string) {
    return this.usersRepository.findOne({
      where: { id }
    })
  }

  findByEmail(email: string) {
    return this.usersRepository.findOne({
      where: { email }
    })
  }

  create(input: CreateUserInput) {
    const user = this.usersRepository.create(input)
    return this.usersRepository.save(user)
  }
}
