import { Inject, Injectable } from '@nestjs/common';
import Helpers from 'src/apsisengine/common/helpers/apsisHelper';
import { KnexErrorService } from 'src/apsisengine/common/knexerrors';
import { KNEX_CONNECTION } from 'src/knexmodule';
import { SaveOrUpdateFormMetaInterface } from './interfaces/save-or-update-form-meta..interface';

@Injectable()
export class FormMetaService {
  constructor(
    @Inject(KNEX_CONNECTION) private readonly knex,
    private readonly knexErrorService: KnexErrorService,
  ) {}

  //save or update form additional data
  async saveOrUpdate(data: SaveOrUpdateFormMetaInterface, company_id: number) {
    //check for existing data reference_id
    const checkExisting = await this.getFormMetaData(data, company_id);

    if (checkExisting.length > 0) {
      //delete data from database
      await this.knex('sys_form_metas')
        .where('sys_form_metas.form_slug', data.form_slug)
        .where('sys_form_metas.company_id', company_id)
        .where('sys_form_metas.reference_id', data.reference_id)
        .delete()
        .catch((error) => this.knexErrorService.errorMessage(error.message));
    }

    //prepare data for insertion
    const formMetaDatas = [];

    data.input_label.forEach((element: any, key: number) => {
      const metaData = {
        company_id: company_id,
        form_slug: data.form_slug,
        reference_id: data.reference_id,
        input_label: element,
        input_value: data.input_value[key],
        created_by: data.user_id ?? '',
        created_at: Helpers.mysql_datetime(),
        status: 1,
      };
      formMetaDatas.push(metaData);
    });
    //insert data into database
    const saveData = await this.knex('sys_form_metas')
      .insert(formMetaDatas)
      .catch((error) => this.knexErrorService.errorMessage(error.message));

    return saveData;
  }

  async findByReferenceSlug(data: any, company_id: number) {
    const formMetaDatas = await this.getFormMetaData(data, company_id);

    return formMetaDatas;
  }

  async getFormMetaData(
    data: SaveOrUpdateFormMetaInterface,
    company_id: number,
  ) {
    return await this.knex('sys_form_metas')
      .where('sys_form_metas.form_slug', data.form_slug)
      .where('sys_form_metas.company_id', company_id)
      .where('sys_form_metas.reference_id', data.reference_id)
      .catch((error) => this.knexErrorService.errorMessage(error.message));
  }
}
