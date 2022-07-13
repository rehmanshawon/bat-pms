import { PartialType } from '@nestjs/swagger';
import { CreateMastergridDto } from './mastergridCreateDto';

export class UpdateMasterGridDto extends PartialType(CreateMastergridDto) {
  updated_at: Date;
  updated_by: number;
}
