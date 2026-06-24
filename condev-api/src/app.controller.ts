import { Controller, Get, UseGuards } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtAuthGuard } from './auth/jwt-auth.guard'

@Controller()
@UseGuards(JwtAuthGuard)
export class AppController {
  constructor(private readonly config: ConfigService) {}

  @Get('app-info')
  getAppInfo() {
    return {
      databaseName: this.config.get<string>('DB_DATABASE', 'condev'),
      systemVersion: this.config.get<string>('SYSTEM_VERSION', '0.1.0')
    }
  }
}
