import { IsBoolean, IsEmail, IsString, MinLength } from 'class-validator'

export class RegisterDto {
  @IsString()
  companyName!: string

  @IsString()
  userName!: string

  @IsEmail({}, { message: 'メールアドレスの形式で入力してください' })
  email!: string

  @IsString()
  @MinLength(8, { message: 'パスワードは8文字以上で入力してください' })
  password!: string

  @IsString()
  confirmPassword!: string

  @IsBoolean()
  agreeTerms!: boolean
}
