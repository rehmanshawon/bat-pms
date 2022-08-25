import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class NotificationData {
  @ApiProperty()
  @IsString()
  readonly code: string;

  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  readonly receipent_id: string[];
}

export class NotificationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly eventSlug: string;

  @ApiPropertyOptional()
  @IsEnum(['High', 'Medium', 'Low'])
  @IsOptional()
  readonly actionPriority?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly sender_id: string;

  @ApiProperty()
  @Type(() => NotificationDto)
  @ValidateNested({ each: true })
  readonly data: NotificationData;
}
