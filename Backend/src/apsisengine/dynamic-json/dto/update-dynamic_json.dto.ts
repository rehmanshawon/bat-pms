import { PartialType } from '@nestjs/swagger';
import { CreateDynamicJsonDto } from './create-dynamic_json.dto';

export class UpdateDynamicJsonDto extends PartialType(CreateDynamicJsonDto) {
  updated_at: Date;
  updated_by: number;
}
