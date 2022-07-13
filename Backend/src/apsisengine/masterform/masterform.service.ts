/**dependencies**/
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
/**knex services**/
import { KnexErrorService } from 'src/apsisengine/common/knexerrors';
import { KNEX_CONNECTION } from 'src/knexmodule';
import { JwtPayloadInterface } from '../auth/interfaces';
/**Redis services**/
import { RedisCacheService } from '../cache/rediscache.service';
/**dto**/
import { MasterformDto } from './dto';

@Injectable()
export class MasterFormService {
  constructor(
    @Inject(KNEX_CONNECTION) private readonly knex,
    private readonly knexErrorService: KnexErrorService,
    private readonly redisCacheService: RedisCacheService,
  ) {}
  async getMasterFormData(
    masterformDto: MasterformDto,
    userPayload: JwtPayloadInterface,
  ) {
    // check for redis masterform data
    const redis_cache_key = `form_c${userPayload.company_id}_${masterformDto.form_slug}`;
    const get_cache_data: any = await this.redisCacheService.get(
      redis_cache_key,
    );
    if (get_cache_data) {
      return JSON.parse(get_cache_data);
    }

    //check for redis default form data
    const default_form_key = `form_${masterformDto.form_slug}`;
    const get_default_form_data: any = await this.redisCacheService.get(
      default_form_key,
    );
    if (get_default_form_data) {
      return JSON.parse(get_default_form_data);
    }

    // retrieve sys_forms table data
    const formstabledata = await this.knex('sys_forms')
      .where('form_slug', masterformDto.form_slug)
      .where('company_id', userPayload.company_id)
      .where('status', 1)
      .select(['form_title'])
      .first()
      .catch((error: { message: string }) =>
        this.knexErrorService.errorMessage(error.message),
      );
    if (!formstabledata) {
      throw new NotFoundException('No master form found');
    }
    //retrieve sys_form_elements table data
    const formelementstabledata = await this.knex('sys_form_elements')
      .where('form_slug', masterformDto.form_slug)
      .where('company_id', userPayload.company_id)
      .where('status', 1)
      .select(
        'form_element_section',
        'element_column',
        'element_class',
        'label_name',
        'label_class',
        'input_type',
        'input_name',
        'input_placeholder',
        'input_id',
        'input_class',
        'input_label',
        'input_value',
        'input_function',
        'sort_number',
        'input_expression',
        'disabled',
        'required',
        'dropdown_slug',
        'dropdown_options',
        'multiple',
        'status',
      )
      .orderBy('sort_number', 'asc')
      .catch((error: { message: string }) =>
        this.knexErrorService.errorMessage(error.message),
      );
    if (!formelementstabledata) {
      throw new NotFoundException('No master form found');
    }
    //form_element_section wise sorting formelementstabledata
    const retrieve_data = {};
    formelementstabledata.map((element) => {
      const modified_element = {
        element_column: element.element_column,
        element_class: element.element_class,
        label_name: element.label_name,
        label_class: element.label_class,
        input_type: element.input_type,
        input_name: element.input_name,
        input_placeholder: element.input_placeholder,
        input_id: element.input_id,
        input_class: element.input_class,
        input_label: element.input_label,
        input_value: element.input_value,
        input_function: element.input_function,
        sort_number: element.sort_number,
        input_expression: element.input_expression,
        disabled: element.disabled,
        required: element.required,
        dropdown_slug: element.dropdown_slug,
        dropdown_options: element.dropdown_options,
        multiple: element.multiple,
        status: element.status,
      };
      if (retrieve_data.hasOwnProperty(element.form_element_section)) {
        retrieve_data[element.form_element_section].push(modified_element);
      } else {
        retrieve_data[element.form_element_section] = [];
        retrieve_data[element.form_element_section].push(modified_element);
      }
    });

    // merge sys_forms & sys_form_elements table data
    const masterformdata = {
      form_title: formstabledata ? formstabledata['form_title'] : '',
      form_element: retrieve_data,
    };

    //set redis data
    await this.redisCacheService.set(
      redis_cache_key,
      JSON.stringify(masterformdata),
    );
    return masterformdata;
  }
}
