import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreatebranchDto } from './dto/create-branch.dto';
import { UpdatebranchDto } from './dto/update-branch.dto';
import { KnexErrorService } from 'src/apsisengine/common/knexerrors';
import { KNEX_CONNECTION } from 'src/knexmodule';

@Injectable()
export class BranchService {
  constructor(
    @Inject(KNEX_CONNECTION) private readonly knex,
    private readonly knexErrorService: KnexErrorService,
  ) {}

  async create(createbranchdto: CreatebranchDto) {
    const result = await this.knex('sys_branchs')
      .insert(createbranchdto)
      .catch((error) => this.knexErrorService.errorMessage(error.message));

    if (!result) {
      throw new NotFoundException('could not created data!');
    }
    return result;
  }

  async findAll() {
    const data = await this.knex
      .select()
      .from('sys_branchs')
      .catch((error) => this.knexErrorService.errorMessage(error.message));
    if (!data) {
      throw new NotFoundException('No data found.');
    }
    return data;
  }

  async findOne(id: number) {
    const data = await this.knex('sys_branchs')
      .where('branch_id', id)
      .catch((error) => this.knexErrorService.errorMessage(error.message));
    if (!data) {
      throw new NotFoundException('No data found.');
    }
    return data;
  }
  async update(id: number, updatebranchdto: UpdatebranchDto) {
    const result = await this.knex('sys_branchs')
      .update(updatebranchdto)
      .where('branch_id', id)
      .catch((error) => this.knexErrorService.errorMessage(error.message));

    if (!result) {
      throw new NotFoundException('could not updated data!');
    }
    return result;
  }

  async remove(id: number, userid, date) {
    const result = await this.knex('sys_branchs')
      .where('branch_id', '=', id)
      .update({
        status: '0',
        deleted_by: userid,
        deleted_at: date,
      })
      .catch((error) => this.knexErrorService.errorMessage(error.message));
    if (!result) {
      throw new NotFoundException('could not update data!');
    }
    return result;
  }
}
