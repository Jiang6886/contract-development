import { IsBoolean, IsEmail, IsOptional, IsString, MinLength } from 'class-validator'

export class LoginDto {
  @IsEmail({}, { message: 'メールアドレスの形式で入力してください' })
  email!: string

  @IsString()
  @MinLength(8, { message: 'パスワードは8文字以上で入力してください' })
  password!: string

  @IsBoolean()
  @IsOptional()
  rememberMe?: boolean
}
