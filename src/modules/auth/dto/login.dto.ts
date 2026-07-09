import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'sardorovsamandar@gmail.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'sardorov010' })
  @IsString()
  @IsNotEmpty()
  password!: string;
}
