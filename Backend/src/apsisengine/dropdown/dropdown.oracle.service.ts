/**dependencies**/
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
/**knex services**/
import { KnexErrorService } from 'src/apsisengine/common/knexerrors';
import { KNEX_CONNECTION } from 'src/knexmodule';
/**dto**/
import { DropdownDto } from './dto';
/** Service **/
import { RedisCacheService } from '../cache';
import CommonHelper from '../common/helpers/commonHelper';
import { CreateDropdownUiDto } from './dto/create-dropdownUi.dto';
import { DeleteDropdownUiDto } from './dto/delete-dropdownUi.dto';
import { UpdateDropdownUiDto } from './dto/update-dropdownUi.dto';
import MessageHelper from '../common/helpers/messageHelper';
import Common_function from 'src/global/common_function.service';

@Injectable()
export class DropdownService {
  constructor(
    @Inject(KNEX_CONNECTION) private readonly knex,
    private readonly knexErrorService: KnexErrorService,
    private readonly redisCacheService: RedisCacheService,
    private readonly commonHelper: CommonHelper,
    private readonly messageHelper: MessageHelper,
    private readonly commonFunction: Common_function,
  ) {}
  async getDropdownData(dropdownDto: DropdownDto, user_data) {
    // check for redis dropdown data
    const redis_cache_key = `dropdown_${dropdownDto.dropdown_slug}`;
    const get_cache_data: any = await this.redisCacheService.get(
      redis_cache_key,
    );
    if (get_cache_data) {
      // console.log('from Redis');
      return JSON.parse(get_cache_data);
    }

    //dropdown data retrieve
    const dropdown = await this.knex('sys_dropdowns')
      .where('dropdown_slug', dropdownDto.dropdown_slug)
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

    console.log(dropdown);
    const dropdownData = [];
    let res = '';
    const select = dropdown.sql_select ? dropdown.sql_select : '';
    const source = dropdown.sql_source ? dropdown.sql_source : '';
    let condition = '';

    if (dropdown.sql_condition && dropdownDto.external_data) {
      condition =
        dropdown.sql_condition +
        ' AND ' +
        (await this.commonHelper.planeExtraCondition(
          dropdownDto.external_data,
        ));
    } else if (!dropdown.sql_condition && dropdownDto.external_data) {
      condition =
        ' WHERE ' +
        (await this.commonHelper.planeExtraCondition(
          dropdownDto.external_data,
        ));
    } else if (dropdown.sql_condition && !dropdownDto.external_data) {
      condition = dropdown.sql_condition;
    } else {
      condition = `where 1`;
    }
    const group_by = dropdown.sql_group_by ? dropdown.sql_group_by : '';
    const having = dropdown.sql_having ? dropdown.sql_having : '';
    const order_by = dropdown.sql_order_by
      ? dropdown.sql_order_by
      : `ORDER BY "${dropdown.option_field}" ASC`;
    const limit = dropdown.sql_limit ? dropdown.sql_limit : '';

    const sqltext = select + ' ' + source + ' ' + condition;
    const sqlconditiony = await this.commonHelper.sessionFilter(
      'sys_dropdowns',
      dropdownDto.dropdown_slug,
      user_data,
      sqltext,
    );

    res =
      sqlconditiony +
      ' ' +
      group_by +
      ' ' +
      having +
      ' ' +
      order_by +
      ' ' +
      limit;
    const dropdownRetrieveData = await this.knex
      .raw(res)
      .catch((error: { message: string }) =>
        this.knexErrorService.errorMessage(error.message),
      );
    if (dropdownRetrieveData.length < 0) {
      throw new NotFoundException('No Dropdown Data found');
    }
    dropdownRetrieveData.map((data) => {
      const dropdownobject = {
        value: data[dropdown.value_field],
        label: data[dropdown.option_field],
      };
      dropdownData.push(dropdownobject);
    });
    //set redis data
    await this.redisCacheService.set(
      redis_cache_key,
      JSON.stringify(dropdownData),
    );
    return dropdownData;
  }

  async create(createdropdownuidto: CreateDropdownUiDto, userPayload) {
    console.log(userPayload);
    createdropdownuidto.company_id = userPayload.company_id;

    const payload: any = createdropdownuidto;
    payload.created_by = userPayload.user_id;
    payload.created_at = this.commonFunction.cmnDatetime();

    const result = await this.knex('sys_dropdowns')
      .insert(payload, 'dropdown_id')
      .catch((error) => this.knexErrorService.errorMessage(error.message));

    if (result === undefined || result.length === 0) {
      return {
        message: await this.messageHelper.lang(
          'ine',
          'sys_dropdowns_create_error',
          {
            code: 'Dropdowns',
          },
        ),
        data: [],
      };
    }
    return {
      message: await this.messageHelper.lang('ine', 'sys_dropdowns_create', {
        code: 'Dropdowns',
      }),
      data: result,
    };
  }

  async findOne(id: number) {
    const data = await this.knex('sys_dropdowns')
      .where({
        dropdown_id: id,
        status: '1',
      })
      .first()
      .catch((error) => this.knexErrorService.errorMessage(error.message));
    if (data === undefined || data.length === 0) {
      return {
        message: await this.messageHelper.lang(
          'ine',
          'sys_dropdowns_get_error',
          {
            code: 'Dropdowns',
          },
        ),
        data: [],
      };
    }
    return {
      message: await this.messageHelper.lang('ine', 'sys_dropdowns_get', {
        code: 'Dropdowns',
      }),
      data: data,
    };
  }

  async update(updatedropdownuidto: UpdateDropdownUiDto, userPayload, id) {
    const payload: any = updatedropdownuidto;
    payload.updated_by = userPayload.user_id;
    payload.updated_at = this.commonFunction.cmnDatetime();

    const result = await this.knex('sys_dropdowns')
      .update(payload)
      .where('dropdown_id', id)
      .catch((error) => this.knexErrorService.errorMessage(error.message));

    if (result === undefined || result.length === 0) {
      return {
        message: await this.messageHelper.lang(
          'ine',
          'sys_dropdowns_update_error',
          {
            code: 'Dropdowns',
          },
        ),
        data: [],
      };
    }
    return {
      message: await this.messageHelper.lang('ine', 'sys_dropdowns_update', {
        code: 'Dropdowns',
      }),
      data: id,
    };
  }
  async remove(data: DeleteDropdownUiDto, userPayload) {
    const userId = userPayload.user_id;
    const result = await this.knex('sys_dropdowns')
      .whereIn('dropdown_id', data.ids)
      .update({
        status: '0',
        deleted_by: userId,
        deleted_at: this.commonFunction.cmnDatetime(),
      })
      .catch((error) => this.knexErrorService.errorMessage(error.message));
    if (result === undefined || result.length === 0) {
      return {
        message: await this.messageHelper.lang(
          'ine',
          'sys_dropdowns_delete_error',
          {
            code: 'Dropdowns',
          },
        ),
        data: [],
      };
    }
    return {
      message: await this.messageHelper.lang('ine', 'sys_dropdowns_delete', {
        code: 'Dropdowns',
      }),
      data: data.ids,
    };
  }
}
