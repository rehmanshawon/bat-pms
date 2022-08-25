import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

class DlmDto {
  @ApiProperty()
  @IsString()
  dlm_steps: string;

  @ApiProperty()
  @IsInt()
  max_limit: number;

  @ApiProperty()
  @IsString()
  limit_type: string;

  @ApiProperty()
  @IsInt()
  order_no: number;
}

class RefEvent {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  branch: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  department: string;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  company: number;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  division: number;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  brand: number;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  product: number;
}

class makerDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  user_id: number;
}

class user {
  @ApiProperty()
  @ValidateIf((o) => o.decline_logic !== '' || o.decline_logic)
  @IsIn(['Previous Approval', 'Initiator'])
  @IsNotEmpty()
  decline_logic: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  max_limit: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  key: number;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateIf((o) => o.limit_type !== '' || o.limit_type)
  @IsIn(['Above', 'Maximum'])
  limit_type: string;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  @Max(1)
  must_approve: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  label: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  value: number;
}

class processFlowDto {
  @ApiProperty()
  @ValidateIf((o) => o.approve_priority !== '' || o.approve_priority)
  @IsIn(['All', 'Majority', 'Minority'])
  @IsNotEmpty()
  approve_priority: string;

  @ApiProperty()
  @ValidateIf((o) => o.manage_by !== '' || o.manage_by)
  @IsIn(['Hierarchy', 'Sorting', 'Limit'])
  @IsNotEmpty()
  manage_by: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  above_checked: boolean;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  same_sort: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  step_name: string;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  step_number: number;

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => user)
  users: user[];
}

export class delegationSubmission {
  @ApiPropertyOptional()
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  @MaxLength(10)
  company_id: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  delegation_for: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  approve_type: string;

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => RefEvent)
  @IsObject()
  @IsNotEmpty()
  ref_event: RefEvent;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => DlmDto)
  DLM: DlmDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => makerDto)
  @IsObject()
  @IsNotEmpty()
  maker_checker: makerDto;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => processFlowDto)
  @IsArray()
  @IsNotEmpty()
  process_flow: processFlowDto[];
}
