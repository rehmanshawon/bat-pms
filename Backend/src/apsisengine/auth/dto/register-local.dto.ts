import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class RegisterLocalDto {
  @ApiProperty({
    description: 'user name',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  readonly user_name: string;

  @ApiProperty({
    description: 'user unique code',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  readonly user_code: string;

  @ApiProperty({ description: 'valid user email', required: true })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({
    description: 'full name',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  readonly full_name: string;

  @ApiProperty({
    description: 'user company id',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  readonly company_id: number;

  @ApiProperty({
    description: 'user branch id',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  readonly branch_id: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  password: string;

  @ApiPropertyOptional()
  @IsDate()
  @IsOptional()
  readonly created_at: Date;
}
