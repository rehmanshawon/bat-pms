import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreatecompanyDto } from './dto/create-company.dto';
import { UpdatecompanyDto } from './dto/update-company.dto';
import { KnexErrorService } from 'src/apsisengine/common/knexerrors';
import { KNEX_CONNECTION } from 'src/knexmodule';

@Injectable()
export class CompanyService {
  constructor(
    @Inject(KNEX_CONNECTION) private readonly knex,
    private readonly knexErrorService: KnexErrorService,
  ) {}

  async create(createcompanydto: CreatecompanyDto) {
    const result = await this.knex('sys_companys')
      .insert(createcompanydto)
      .catch((error) => this.knexErrorService.errorMessage(error.message));

    if (!result) {
      throw new NotFoundException('could not created data!');
    }
    return result;
  }

  async findAll() {
    const data = await this.knex
      .select()
      .from('sys_companys')
      .catch((error) => this.knexErrorService.errorMessage(error.message));
    if (!data) {
      throw new NotFoundException('No data found.');
    }
    return data;
  }

  async findOne(id: number) {
    const data = await this.knex('sys_companys')
      .where('company_id', id)
      .catch((error) => this.knexErrorService.errorMessage(error.message));
    if (!data) {
      throw new NotFoundException('No data found.');
    }
    return data;
  }
  async update(id: number, updatecompanydto: UpdatecompanyDto) {
    const result = await this.knex('sys_companys')
      .update(updatecompanydto)
      .where('company_id', id)
      .catch((error) => this.knexErrorService.errorMessage(error.message));

    if (!result) {
      throw new NotFoundException('could not updated data!');
    }
    return result;
  }

  async remove(id: number, userid, date) {
    const result = await this.knex('sys_companys')
      .where('company_id', '=', id)
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
