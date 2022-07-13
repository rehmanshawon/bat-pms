import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
/**knex services**/
import { KnexErrorService } from 'src/apsisengine/common/knexerrors';
import { KNEX_CONNECTION } from 'src/knexmodule';
import { JwtPayloadInterface } from '../auth/interfaces';
/**Redis services**/
import { RedisCacheService } from '../cache';

@Injectable()
export class ModuleChangerService {
  constructor(
    @Inject(KNEX_CONNECTION) private readonly knex,
    private readonly knexErrorService: KnexErrorService,
    private readonly redisCacheService: RedisCacheService,
  ) {}

  //get list of authorized module list for user
  async moduleListData(userData: JwtPayloadInterface) {
    const moduleListData = await this.moduleListByUser(userData);
    return moduleListData;
  }

  async moduleChangerData(module_id: number, user_id: number) {
    const data: any = {};
    data.module_id = module_id;
    data.user_id = user_id;

    const module_data = await this.moduleInfoByUserAndModuleId(data);

    if (!module_data) {
      throw new ForbiddenException('Forbidden Resource!');
    }

    //get privilege menu modules
    const menu_infos = await this.userMenuByModule(data);

    if (!menu_infos) {
      throw new NotFoundException('No menu data found!');
    }
    const menu_tree = (items: any[], menu_id = 0, link = 'parent_menu_id') =>
      items
        .filter((item) => item[link] === menu_id)
        .map((item) => ({
          ...item,
          children: menu_tree(items, item.menu_id),
        }));
    const print_menu_tree = menu_tree(menu_infos);

    return { module_info: module_data, menu_list: print_menu_tree };
  }

  //get all module list by user id
  async moduleListByUser(user_data) {
    const moduleList = await this.knex('sys_modules')
      .select(
        'sys_modules.module_id',
        'sys_modules.module_name',
        'sys_modules.module_icon',
        'sys_modules.module_lang',
        'sys_modules.module_url',
      )
      .join(
        'sys_privilege_modules',
        'sys_modules.module_id',
        'sys_privilege_modules.module_id',
      )
      .join(
        'sys_company_modules',
        'sys_modules.module_id',
        'sys_company_modules.module_id',
      )
      .where('sys_privilege_modules.user_id', user_data.user_id)
      .where('sys_privilege_modules.company_id', user_data.company_id)
      .where('sys_company_modules.company_id', user_data.company_id)
      .where('sys_modules.status', '1')
      .groupBy(
        'sys_modules.module_id',
        'sys_modules.module_name',
        'sys_modules.module_icon',
        'sys_modules.module_lang',
        'sys_modules.module_url',
      )
      .catch((error: { message: string }) =>
        this.knexErrorService.errorMessage(error.message),
      );

    if (!moduleList) {
      throw new NotFoundException('No module data found');
    }
    return moduleList;
  }

  //get module info by user and company id
  async moduleInfoByUserAndModuleId(data: any) {
    const module_info = await this.knex('sys_modules')
      .select(
        'sys_modules.module_id',
        'sys_modules.module_name',
        'sys_modules.module_icon',
        'sys_modules.module_lang',
        'sys_modules.module_url',
      )
      .join(
        'sys_privilege_modules',
        'sys_modules.module_id',
        'sys_privilege_modules.module_id',
      )
      .join(
        'sys_company_modules',
        'sys_modules.module_id',
        'sys_company_modules.module_id',
      )
      .where('sys_modules.module_id', data.module_id)
      .where('sys_privilege_modules.user_id', data.user_id)
      .where('sys_modules.status', '1')
      .groupBy(
        'sys_modules.module_id',
        'sys_modules.module_name',
        'sys_modules.module_icon',
        'sys_modules.module_lang',
        'sys_modules.module_url',
      )
      .first()
      .catch((error: { message: string }) =>
        this.knexErrorService.errorMessage(error.message),
      );

    if (!module_info) {
      throw new ForbiddenException('Forbidden Resource!');
    }
    return module_info;
  }

  async userMenuByModule(data: any) {
    const menu_data = await this.knex('sys_menus')
      .select(
        'sys_menus.menu_id',
        'sys_menus.parent_menu_id',
        'sys_menus.module_id',
        'sys_menus.menu_name',
        'sys_menus.menu_icon_class',
        'sys_menus.menu_url',
        'sys_menus.sort_number',
      )
      .join('sys_privilege_menus', function () {
        this.on('sys_menus.menu_id ', '=', ' sys_privilege_menus.menu_id ');
        this.andOn(
          'sys_menus.company_id ',
          '=',
          ' sys_privilege_menus.company_id',
        );
      })
      .join('sys_privilege_roles', function () {
        this.on(
          'sys_privilege_menus.role_id',
          '=',
          'sys_privilege_roles.role_id',
        );
        this.andOn(
          'sys_privilege_menus.company_id',
          '=',
          'sys_privilege_roles.company_id',
        );
      })
      .join('sys_privilege_modules', function () {
        this.on('sys_menus.module_id', '=', 'sys_privilege_modules.module_id');
        this.andOn(
          'sys_privilege_menus.company_id',
          '=',
          'sys_privilege_modules.company_id',
        );
      })
      .join('sys_users', function () {
        this.on('sys_privilege_modules.user_id', '=', 'sys_users.user_id');
        this.andOn('sys_privilege_roles.user_id', '=', 'sys_users.user_id');
        this.andOn(
          'sys_privilege_modules.company_id',
          '=',
          'sys_users.company_id',
        );
      })
      .where('sys_menus.module_id', data.module_id)
      .where('sys_users.user_id', data.user_id)
      .where('sys_menus.status', 1)
      .groupBy(
        'sys_menus.menu_id',
        'sys_menus.parent_menu_id',
        'sys_menus.module_id',
        'sys_menus.menu_name',
        'sys_menus.menu_icon_class',
        'sys_menus.menu_url',
        'sys_menus.sort_number',
      )
      .orderBy('sys_menus.sort_number')
      .catch((error: { message: string }) =>
        this.knexErrorService.errorMessage(error.message),
      );

    if (!menu_data) {
      throw new NotFoundException('No menu data found!');
    }

    return menu_data;
  }

  async companyAndModuleWiseMenusDataSet() {
    //retrieve sys_menus table data
    const menus_privilege_roles_table_data = await this.knex('sys_menus')
      .where('status', '1')
      .catch((error: { message: string }) =>
        this.knexErrorService.errorMessage(error.message),
      );
    if (!menus_privilege_roles_table_data) {
      throw new NotFoundException('No master form found');
    }
    const menus_privilege_roles_table_data_after_sort = [];

    //company_id and module_id wise sorting
    menus_privilege_roles_table_data.forEach((companywiseobject, index) => {
      const c_index =
        companywiseobject.company_id + '_' + companywiseobject.module_id;
      if (index === 0) {
        menus_privilege_roles_table_data_after_sort[c_index] = [
          companywiseobject,
        ];
      } else {
        if (
          menus_privilege_roles_table_data_after_sort.hasOwnProperty(c_index)
        ) {
          menus_privilege_roles_table_data_after_sort[c_index] = [
            ...menus_privilege_roles_table_data_after_sort[c_index],
            companywiseobject,
          ];
        } else {
          menus_privilege_roles_table_data_after_sort[c_index] = [
            companywiseobject,
          ];
        }
      }
    });

    //get privilege menu modules
    const menu_tree = (items: any[], menu_id = 0, link = 'parent_menu_id') =>
      items
        .filter((item) => item[link] === menu_id)
        .map((item) => ({
          ...item,
          children: menu_tree(items, item.menu_id),
        }));
    for (const property in menus_privilege_roles_table_data_after_sort) {
      menus_privilege_roles_table_data_after_sort[property] = menu_tree(
        menus_privilege_roles_table_data_after_sort[property],
      );
      //set redis data
      const propertysplit = property.split('_');
      const companyid = propertysplit[0];
      const moduleid = propertysplit[1];
      const redis_cache_key = `company${companyid}_module${moduleid}_menus`;
      await this.redisCacheService.set(
        redis_cache_key,
        JSON.stringify(menus_privilege_roles_table_data_after_sort[property]),
      );
    }
  }

  async companyAndModuleWiseMenusDataGet(
    company_id: number,
    module_id: number,
  ) {
    //check for redis data
    const redis_cache_key = `company${company_id}_module${module_id}_menus`;
    const get_cache_data: any = await this.redisCacheService.get(
      redis_cache_key,
    );
    return JSON.parse(get_cache_data);
  }
}
