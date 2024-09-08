import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsStrongPassword } from "class-validator"

export class RegisterDto {
  @ApiProperty({
    description: 'User email',
    example: 'h2e5T@example.com',
    required: true
  })
  @IsEmail()
  email: string
  @ApiProperty({
    description: 'User password',
    example: 'password',
    required: true
  })
  @IsStrongPassword()
  password: string
}