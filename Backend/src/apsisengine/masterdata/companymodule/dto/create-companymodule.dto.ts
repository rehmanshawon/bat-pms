import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';
export class CreatecompanymoduleDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  module_id: number;

  @IsOptional()
  @IsInt()
  company_id: number;
}
