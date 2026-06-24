import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { AuthModule } from './auth/auth.module'
import { CustomersModule } from './customers/customers.module'
import { Customer } from './customers/customer.entity'
import { UsersModule } from './users/users.module'
import { User } from './users/user.entity'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST', '127.0.0.1'),
        port: config.get<number>('DB_PORT', 3306),
        username: config.get<string>('DB_USERNAME', 'condev'),
        password: config.get<string>('DB_PASSWORD', 'condev_password'),
        database: config.get<string>('DB_DATABASE', 'condev'),
        entities: [User, Customer],
        // Keep disabled for local data safety. Schema changes should be applied explicitly.
        synchronize: config.get<string>('DB_SYNCHRONIZE', 'false') === 'true'
      })
    }),
    UsersModule,
    CustomersModule,
    AuthModule
  ],
  controllers: [AppController]
})
export class AppModule {}
