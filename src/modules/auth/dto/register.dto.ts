import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'samandar' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  username!: string;

  @ApiProperty({ example: 'samandarsardorov@gmail.com' })
  @IsEmail({}, { message: 'Email formati noto\'g\'ri' })
  email!: string;

  @ApiProperty({ example: 'sardorov010' })
  @IsString()
  @MinLength(8, { message: 'Parol kamida 8 ta belgidan iborat bo\'lishi kerak' })
  @MaxLength(64)
  password!: string;
}
