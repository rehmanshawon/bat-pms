import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDate,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateMastergridDto {
  @IsOptional()
  @IsInt()
  module_id: number;

  @IsOptional()
  @IsInt()
  company_id: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  master_grid_slug: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  master_entry_name: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  master_entry_url: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  master_grid_title: string;

  @IsOptional()
  @IsString()
  master_column_title: string;

  @IsOptional()
  @IsString()
  sql_select: string;

  @IsOptional()
  @IsString()
  sql_source: string;

  @IsOptional()
  @IsString()
  sql_condition: string;

  @IsOptional()
  @IsString()
  sql_group_by: string;

  @IsOptional()
  @IsString()
  sql_having: string;

  @IsOptional()
  @IsString()
  sql_order_by: string;

  @IsOptional()
  @IsString()
  sql_limit: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  action_table: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  primary_key_field: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  data_link: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  status_field: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  search_panel_slug: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  hide_col_position: string;

  @IsOptional()
  @IsString()
  search_columns: string;

  @IsOptional()
  @IsString()
  tr_data_attr: string;

  @IsOptional()
  @IsInt()
  enable_form: number;

  @IsOptional()
  @IsInt()
  is_selectable: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  additional_grid: string;

  @IsOptional()
  @IsInt()
  export_excel: number;

  @IsOptional()
  @IsInt()
  export_pdf: number;

  @IsOptional()
  @IsInt()
  export_csv: number;

  @IsOptional()
  @IsInt()
  export_printing: number;

  @IsOptional()
  @IsInt()
  client_side: number;

  @IsOptional()
  @IsString()
  page_customize: string;

  @IsOptional()
  @IsInt()
  grid_checkbox: number;

  @IsOptional()
  @IsInt()
  grid_serial: number;

  @IsOptional()
  @IsInt()
  tagg_html: number;

  @IsOptional()
  @IsInt()
  created_by: number;

  @IsOptional()
  @IsDate()
  created_at: Date;

  @IsOptional()
  @IsArray()
  hide_columns: string[];
}
