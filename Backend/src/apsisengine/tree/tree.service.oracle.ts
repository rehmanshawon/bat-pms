/**dependencies**/
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
/**knex services**/
import { KnexErrorService } from 'src/apsisengine/common/knexerrors';
import { KNEX_CONNECTION } from 'src/knexmodule';
import CommonHelper from '../common/helpers/commonHelper';
/**dto**/
import { TreeDto } from './dto';

@Injectable()
export class TreeService {
  constructor(
    @Inject(KNEX_CONNECTION) private readonly knex,
    private readonly knexErrorService: KnexErrorService,
    private readonly commonHelper: CommonHelper,
  ) {}
  async getTreeData(treeDto: TreeDto) {
    //dropdown data retrieve
    const dropdowntabledata = await this.knex('sys_dropdowns')
      .where('dropdown_slug', treeDto.tree_slug)
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

    // generated sql from dropdown_table
    let sql = '';
    const select = dropdowntabledata.sql_select
      ? dropdowntabledata.sql_select
      : '';
    const source = dropdowntabledata.sql_source
      ? dropdowntabledata.sql_source
      : '';
    let condition = '';

    if (dropdowntabledata.sql_condition && treeDto.external_data) {
      condition =
        dropdowntabledata.sql_condition +
        ' AND ' +
        (await this.commonHelper.planeExtraCondition(treeDto.external_data));
    } else if (!dropdowntabledata.sql_condition && treeDto.external_data) {
      condition =
        ' WHERE ' +
        (await this.commonHelper.planeExtraCondition(treeDto.external_data));
    } else if (dropdowntabledata.sql_condition && !treeDto.external_data) {
      condition = `${dropdowntabledata.sql_condition}`;
    }
    const group_by = dropdowntabledata.sql_group_by
      ? dropdowntabledata.sql_group_by
      : '';
    const having = dropdowntabledata.sql_having
      ? dropdowntabledata.sql_having
      : '';
    const order_by = dropdowntabledata.sql_order_by
      ? dropdowntabledata.sql_order_by
      : `ORDER BY "${dropdowntabledata.option_field}" DESC`;
    const limit = dropdowntabledata.sql_limit
      ? dropdowntabledata.sql_limit
      : '';
    sql =
      select +
      ' ' +
      source +
      ' ' +
      condition +
      ' ' +
      group_by +
      ' ' +
      having +
      ' ' +
      order_by +
      ' ' +
      limit;

    // findout dropdown element data
    const dropdownRetrieveData = await this.knex
      .raw(sql)
      .catch((error: { message: string }) =>
        this.knexErrorService.errorMessage(error.message),
      );
    if (!dropdownRetrieveData) {
      throw new NotFoundException('No Dropdown Data found');
    }
    let parent_field = '';
    const columns =
      dropdownRetrieveData.length > 0
        ? Object.keys(dropdownRetrieveData[0])
        : await this.commonHelper.columnArray(select);

    columns.map((col) => {
      if (col.indexOf('parent') > -1) {
        parent_field = col;
      }
    });
    dropdownRetrieveData.map((item) => {
      if (item[parent_field] === null) {
        item[parent_field] = 0;
      }
    });
    // dropdown data manipulation
    const dropdown_tree = (items: any[], menu_id = 0, link = parent_field) => {
      return items
        .filter((item) => item[link] === menu_id)
        .map((item) => ({
          value: item[dropdowntabledata.value_field],
          label: item[dropdowntabledata.option_field],
          children: dropdown_tree(items, item[dropdowntabledata.value_field]),
        }));
    };

    return dropdown_tree(dropdownRetrieveData);
  }
}
