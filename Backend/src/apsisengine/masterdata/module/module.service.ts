import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreatemoduleDto } from './dto/create-module.dto';
import { UpdatemoduleDto } from './dto/update-module.dto';
import { KnexErrorService } from 'src/apsisengine/common/knexerrors';
import { KNEX_CONNECTION } from 'src/knexmodule';

@Injectable()
export class ModuleService {
  constructor(
    @Inject(KNEX_CONNECTION) private readonly knex,
    private readonly knexErrorService: KnexErrorService,
  ) {}

  async create(createmoduledto: CreatemoduleDto) {
    const result = await this.knex('sys_modules')
      .insert(createmoduledto)
      .catch((error) => this.knexErrorService.errorMessage(error.message));

    if (!result) {
      throw new NotFoundException('could not created data!');
    }
    return result;
  }

  async findAll() {
    const data = await this.knex
      .select()
      .from('sys_modules')
      .catch((error) => this.knexErrorService.errorMessage(error.message));
    if (!data) {
      throw new NotFoundException('No data found.');
    }
    return data;
  }

  async findOne(id: number) {
    const data = await this.knex('sys_modules')
      .where('module_id', id)
      .catch((error) => this.knexErrorService.errorMessage(error.message));
    if (!data) {
      throw new NotFoundException('No data found.');
    }
    return data;
  }
  async update(id: number, updatemoduledto: UpdatemoduleDto) {
    const result = await this.knex('sys_modules')
      .update(updatemoduledto)
      .where('module_id', id)
      .catch((error) => this.knexErrorService.errorMessage(error.message));

    if (!result) {
      throw new NotFoundException('could not updated data!');
    }
    return result;
  }

  async remove(id: number, userid, date) {
    const result = await this.knex('sys_modules')
      .where('module_id', '=', id)
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
