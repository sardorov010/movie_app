import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({ example: 'admin1' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  username: string;

  @ApiProperty({ example: 'admin1@kinolar.uz' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Admin12345' })
  @IsString()
  @MinLength(8)
  @MaxLength(64)
  password: string;
}
