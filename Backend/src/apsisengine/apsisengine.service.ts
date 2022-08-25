/**dependencies */
import { Inject, Injectable } from '@nestjs/common';
/**knex services */
import { KnexErrorService } from 'src/apsisengine/common/knexerrors';
import { KNEX_CONNECTION } from 'src/knexmodule';
/**external services */
import { IdlogicService } from './idlogic';

@Injectable()
export class ApsisengineService {
  constructor(
    @Inject(KNEX_CONNECTION) private readonly knex,
    private readonly knexErrorService: KnexErrorService,
    private readonly idLogicService: IdlogicService,
  ) {}

  async testDB() {
    const data = await this.knex('sys_users')
      .first()
      .catch((error) => this.knexErrorService.errorMessage(error.message));

    return data;
  }
}
