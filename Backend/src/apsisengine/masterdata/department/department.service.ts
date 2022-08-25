import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreatedepartmentDto } from './dto/create-department.dto';
import { UpdatedepartmentDto } from './dto/update-department.dto';
import { KnexErrorService } from 'src/apsisengine/common/knexerrors';
import { KNEX_CONNECTION } from 'src/knexmodule';

@Injectable()
export class DepartmentService {
  constructor(
    @Inject(KNEX_CONNECTION) private readonly knex,
    private readonly knexErrorService: KnexErrorService,
  ) {}

  async create(createdepartmentdto: CreatedepartmentDto) {
    const result = await this.knex('sys_departments')
      .insert(createdepartmentdto)
      .catch((error) => this.knexErrorService.errorMessage(error.message));

    if (!result) {
      throw new NotFoundException('could not created data!');
    }
    return result;
  }

  async findAll() {
    const data = await this.knex
      .select()
      .from('sys_departments')
      .catch((error) => this.knexErrorService.errorMessage(error.message));
    if (!data) {
      throw new NotFoundException('No data found.');
    }
    return data;
  }

  async findOne(id: number) {
    const data = await this.knex('sys_departments')
      .where('department_id', id)
      .catch((error) => this.knexErrorService.errorMessage(error.message));
    if (!data) {
      throw new NotFoundException('No data found.');
    }
    return data;
  }
  async update(id: number, updatedepartmentdto: UpdatedepartmentDto) {
    const result = await this.knex('sys_departments')
      .update(updatedepartmentdto)
      .where('department_id', id)
      .catch((error) => this.knexErrorService.errorMessage(error.message));

    if (!result) {
      throw new NotFoundException('could not updated data!');
    }
    return result;
  }

  async remove(id: number, userid, date) {
    const result = await this.knex('sys_departments')
      .where('department_id', '=', id)
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
