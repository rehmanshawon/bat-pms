import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreatefeatureDto } from './dto/create-feature.dto';
import { UpdatefeatureDto } from './dto/update-feature.dto';
import { KnexErrorService } from 'src/apsisengine/common/knexerrors';
import { KNEX_CONNECTION } from 'src/knexmodule';

@Injectable()
export class FeatureService {
  constructor(
    @Inject(KNEX_CONNECTION) private readonly knex,
    private readonly knexErrorService: KnexErrorService,
  ) {}

  async create(createfeaturedto: CreatefeatureDto) {
    const result = await this.knex('sys_features')
      .insert(createfeaturedto)
      .catch((error) => this.knexErrorService.errorMessage(error.message));

    if (!result) {
      throw new NotFoundException('could not created data!');
    }
    return result;
  }

  async findAll() {
    const data = await this.knex
      .select()
      .from('sys_features')
      .catch((error) => this.knexErrorService.errorMessage(error.message));
    if (!data) {
      throw new NotFoundException('No data found.');
    }
    return data;
  }

  async findOne(id: number) {
    const data = await this.knex('sys_features')
      .where('feature_id', id)
      .catch((error) => this.knexErrorService.errorMessage(error.message));
    if (!data) {
      throw new NotFoundException('No data found.');
    }
    return data;
  }
  async update(id: number, updatefeaturedto: UpdatefeatureDto) {
    const result = await this.knex('sys_features')
      .update(updatefeaturedto)
      .where('feature_id', id)
      .catch((error) => this.knexErrorService.errorMessage(error.message));

    if (!result) {
      throw new NotFoundException('could not updated data!');
    }
    return result;
  }

  async remove(id: number, userid, date) {
    const result = await this.knex('sys_features')
      .where('feature_id', '=', id)
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
