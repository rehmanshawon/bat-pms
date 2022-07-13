/**dependencies**/
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
/**knex services**/
import { KnexErrorService } from 'src/apsisengine/common/knexerrors';
import { KNEX_CONNECTION } from 'src/knexmodule';
import { JwtPayloadInterface } from '../auth/interfaces';
import { RedisCacheService } from '../cache';
/**dto**/
import { AutocompleteDto } from './dto';

@Injectable()
export class AutocompleteService {
  constructor(
    @Inject(KNEX_CONNECTION) private readonly knex,
    private readonly knexErrorService: KnexErrorService,
    private readonly redisCacheService: RedisCacheService,
  ) {}
  async getAutocompleteData(
    autocompleteDto: AutocompleteDto,
    userPayload: JwtPayloadInterface,
  ) {
    // check for redis Autocomplete data
    const redis_cache_key = `company_${userPayload.company_id}dropdown_${autocompleteDto.dropdown_slug}_autocomplete_${autocompleteDto.requested_text}`;
    const get_cache_data: any = await this.redisCacheService.get(
      redis_cache_key,
    );
    if (get_cache_data) {
      return JSON.parse(get_cache_data);
    }

    const dropdowntabledata = await this.knex('sys_dropdowns')
      .where('dropdown_slug', autocompleteDto.dropdown_slug)
      .where('company_id', userPayload.company_id)
      .where('status', '1')
      .select(
        'dropdown_id',
        'dropdown_name',
        'company_id',
        'dropdown_slug',
        'sql_select',
        'sql_source',
        'sql_condition',
        'sql_group_by',
        'sql_having',
        'sql_order_by',
        'sql_limit',
        'value_field',
        'option_field',
        'search_columns',
        'description',
      )
      .first()
      .catch((error: { message: string }) =>
        this.knexErrorService.errorMessage(error.message),
      );
    if (!dropdowntabledata) {
      throw new NotFoundException('No Dropdown Data found');
    }
    let generated_sql = '';
    let where = '';
    if (autocompleteDto.external_data) {
    }

    if (dropdowntabledata.sql_condition && autocompleteDto.external_data) {
      where +=
        dropdowntabledata.sql_condition +
        ' AND ' +
        autocompleteDto.external_data;
    } else if (
      !dropdowntabledata.sql_condition &&
      autocompleteDto.external_data
    ) {
      where += ' where ' + autocompleteDto.external_data;
    } else if (
      dropdowntabledata.sql_condition &&
      !autocompleteDto.external_data
    ) {
      where += dropdowntabledata.sql_condition;
    } else {
      where += `where 1`;
    }

    let search_columns = [];
    if (autocompleteDto.requested_text) {
      const requested_text = autocompleteDto.requested_text.toLowerCase();
      if (dropdowntabledata.search_columns) {
        search_columns = dropdowntabledata.search_columns.split(',');
      } else {
        search_columns = dropdowntabledata.sql_select
          .toLowerCase()
          .replace('select', '')
          .replace(/(\r\n\t\s|\n|\r|\t|\s)/gm, '')
          .split(',');
      }
      where += ' AND (';
      search_columns.map((item, index) => {
        if (index > 0) {
          where += ' OR ';
        }
        where += ` LOWER(${item}:: text) LIKE '%${requested_text}%' `;
      });
      where += ')';
    }
    const select = dropdowntabledata.sql_select
      ? dropdowntabledata.sql_select
      : '';
    const source = dropdowntabledata.sql_source
      ? dropdowntabledata.sql_source
      : '';
    const group_by = dropdowntabledata.sql_group_by
      ? dropdowntabledata.sql_group_by
      : '';
    const having = dropdowntabledata.sql_having
      ? dropdowntabledata.sql_having
      : '';
    const order_by = dropdowntabledata.sql_order_by
      ? dropdowntabledata.sql_order_by
      : `ORDER BY ${dropdowntabledata.option_field} ASC`;
    const limit = dropdowntabledata.sql_limit
      ? dropdowntabledata.sql_limit
      : ' LIMIT 100';
    generated_sql =
      select.replace(/(\r\n\t\s|\n|\r|\t|\s)/gm, ' ') +
      ' ' +
      source.replace(/(\r\n\t\s|\n|\r|\t|\s)/gm, ' ') +
      ' ' +
      where.replace(/(\r\n\t\s|\n|\r|\t|\s)/gm, ' ') +
      ' ' +
      group_by.replace(/(\r\n\t\s|\n|\r|\t|\s)/gm, ' ') +
      ' ' +
      having.replace(/(\r\n\t\s|\n|\r|\t|\s)/gm, ' ') +
      ' ' +
      order_by.replace(/(\r\n\t\s|\n|\r|\t|\s)/gm, ' ') +
      ' ' +
      limit;

    const autocompleteTableData = await this.knex
      .raw(generated_sql)
      .catch((error: { message: string }) =>
        this.knexErrorService.errorMessage(error.message),
      );
    if (!autocompleteTableData) {
      throw new NotFoundException('No Dropdown Data found');
    }
    const autocompleteData = [];
    autocompleteTableData.rows.map((data) => {
      const dropdownobject = {
        value: data[dropdowntabledata.value_field],
        label: data[dropdowntabledata.option_field],
      };
      autocompleteData.push(dropdownobject);
    });

    //set redis data
    await this.redisCacheService.set(
      redis_cache_key,
      JSON.stringify(autocompleteData),
    );

    return autocompleteData;
  }
}
