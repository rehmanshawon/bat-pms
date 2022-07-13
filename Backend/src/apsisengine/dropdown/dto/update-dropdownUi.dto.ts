import { PartialType } from '@nestjs/swagger';
import { CreateDropdownUiDto } from './create-dropdownUi.dto';

export class UpdateDropdownUiDto extends PartialType(CreateDropdownUiDto) {
  updated_at: Date;
  updated_by: number;
}
