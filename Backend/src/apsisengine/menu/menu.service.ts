/**dependencies**/
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
/**knex services**/
import { KnexErrorService } from 'src/apsisengine/common/knexerrors';
import { KNEX_CONNECTION } from 'src/knexmodule';
import { JwtPayloadInterface } from '../auth/interfaces';
import Helpers from '../common/helpers/apsisHelper';
/**dto**/
import { CreatemenuDto } from './dto/create-menu.dto';
import { UpdatemenuDto } from './dto/update-menu.dto';
import Common_function from 'src/global/common_function.service';

@Injectable()
export class MenuService {
  constructor(
    @Inject(KNEX_CONNECTION) private readonly knex,
    private readonly knexErrorService: KnexErrorService,
    private readonly cmnFunction: Common_function,
  ) {}

  async create(createmenudto: CreatemenuDto) {
    const payload: any = createmenudto;
    payload.created_at = this.cmnFunction.cmnDatetime();
    const result = await this.knex('sys_menus')
      .insert(createmenudto, 'menu_id')
      .catch((error) => this.knexErrorService.errorMessage(error.message));

    if (!result) {
      throw new NotFoundException('could not created data!');
    }
    return result;
  }

  async findAll() {
    const data = await this.knex
      .select()
      .from('sys_menus')
      .catch((error) => this.knexErrorService.errorMessage(error.message));
    if (!data) {
      throw new NotFoundException('No data found.');
    }
    return data;
  }

  async findOne(id: number) {
    const data = await this.knex('sys_menus')
      .where('module_id', id)
      .orderBy('sort_number')
      .catch((error) => this.knexErrorService.errorMessage(error.message));
    if (!data) {
      throw new NotFoundException('data with given id is not found!!!');
    } else {
      const dropdown_tree = (items: any[], parent_menu_id = 0) =>
        items
          .filter(
            (item) =>
              item['parent_menu_id'] === parent_menu_id && item['status'] != 0,
          )
          .map((item) => ({
            key: item['menu_id'],
            menu_id: item['menu_id'],
            module_id: item['module_id'],
            title: item['menu_name'],
            menu_description: item['menu_description'],
            menu_icon_class: item['menu_icon_class'],
            menu_url: item['menu_url'],
            parent_menu_id: item['parent_menu_id'],
            sort_number: item['sort_number'],
            children: dropdown_tree(items, item['menu_id']),
          }));

      const dropdownData = dropdown_tree(data);
      return dropdownData;
    }
  }

  async update(id: number, updatemenudto: UpdatemenuDto) {
    const result = await this.knex('sys_menus')
      .update(updatemenudto)
      .where('menu_id', id)
      .catch((error) => this.knexErrorService.errorMessage(error.message));

    if (!result) {
      throw new NotFoundException('could not updated data!');
    }
    return result;
  }

  async remove(id: number, userid) {
    const result = await this.knex('sys_menus')
      .where('menu_id', '=', id)
      .update({
        status: '0',
        deleted_by: userid,
        deleted_at: this.cmnFunction.cmnDatetime(),
      })
      .catch((error) => this.knexErrorService.errorMessage(error.message));
    if (!result) {
      throw new NotFoundException('could not update data!');
    }
    return result;
  }

  async findMenuInfo(id: number) {
    const data = await this.knex('sys_menus')
      .where('menu_id', id)
      .catch((error) => this.knexErrorService.errorMessage(error.message));

    const object = {
      menu_id: data[0].menu_id,
      menu_name: data[0].menu_name,
      module_id: data[0].module_id,
      menu_url: data[0].menu_url,
      menu_icon_class: data[0].menu_icon_class,
      menu_description: data[0].menu_description,
    };
    return object;
  }

  async createNewStructure(
    UpdatemenuDto: UpdatemenuDto,
    userPayload: JwtPayloadInterface,
  ) {
    const payload: any = UpdatemenuDto;
    payload.updated_by = userPayload.user_id;
    payload.updated_at = this.cmnFunction.cmnDatetime();
    payload.company_id = userPayload.company_id;
    // return payload;
    const Array = [];

    const modifyFucntion = (items, menu_id) => {
      items &&
        items.map((item, index) => {
          item.parent_menu_id = menu_id;
          if (item.children && item.children.length != 0) {
            modifyFucntion(item.children, item.menu_id);
          }
          const obj = {
            menu_id: item.menu_id,
            module_id: item.module_id,
            menu_name: item.title,
            menu_description: item.menu_description,
            menu_icon_class: item.menu_icon_class,
            menu_url: item.menu_url,
            parent_menu_id: item.parent_menu_id,
            sort_number: index,
          };
          Array.push(obj);
        });
    };

    payload.menuTree.map((items, index) => {
      items.parent_menu_id = 0;
      const obj = {
        menu_id: items.menu_id,
        module_id: items.module_id,
        menu_name: items.title,
        menu_description: items.menu_description,
        menu_icon_class: items.menu_icon_class,
        menu_url: items.menu_url,
        parent_menu_id: items.parent_menu_id,
        sort_number: index,
      };
      Array.push(obj);
      if (items.children && items.children.length != 0) {
        modifyFucntion(items.children, items.menu_id);
      }
    });
    //return Array;
    //console.log(Array, Array.length);

    for (let i = 0; i < Array.length; i++) {
      const object = {
        parent_menu_id: Array[i].parent_menu_id,
        sort_number: Array[i].sort_number,
      };
      await this.knex('sys_menus')
        .update(object)
        .where('menu_id', Array[i].menu_id)
        .catch((error) => this.knexErrorService.errorMessage(error.message));
    }
  }
  async UpdateMenu(
    createmenudto: CreatemenuDto,
    userPayload: JwtPayloadInterface,
  ) {
    const payload: any = createmenudto;
    payload.updated_by = userPayload.user_id;
    payload.updated_at = this.cmnFunction.cmnDatetime();
    payload.company_id = userPayload.company_id;

    await this.knex('sys_menus')
      .update(payload)
      .where('menu_id', payload.menu_id)
      .catch((error) => this.knexErrorService.errorMessage(error.message));
  }

  async getMenuPrivilege(payload, userPayload) {
    const menuIds = [];
    let privilegeData = [];
    const modifyFucntion = async (
      dbData: any[],
      privilegeData: any[],
      role_id: number,
    ) => {
      for (let index = 0; index < dbData.length; index++) {
        const element = dbData[index];
        const result = privilegeData.filter((item) => {
          return item.menu_id == element.menu_id;
        });
        if (element.parent_menu_id == 0) {
          result.length > 0
            ? (element['checked'] = true)
            : (element['checked'] = false);
        } else {
          result.length > 0
            ? (element['checked'] = true)
            : (element['checked'] = false);
          // if (result.length > 0 && element.parent_menu_id != 0) {
          //   element['checked'] = true;
          // } else if (result.length == 0 && element.parent_menu_id != 0) {
          //   element['checked'] = false;
          // }
        }
        if (element.children && element.children.length != 0) {
          modifyFucntion(element.children, privilegeData, payload.role_id);
        }
      }
    };
    const cb = async (e) => {
      menuIds.push(e.menu_id);
      e.children && e.children.forEach(cb);
    };
    const dbData = await this.findOne(payload.module_id);
    dbData.forEach(cb);
    privilegeData = await this.checkAvailableData(menuIds, payload.role_id);
    await modifyFucntion(dbData, privilegeData, payload.role_id);
    return dbData;
  }
  async updateMenuPrivilege(UpdatemenuDto, userPayload) {
    //console.log(UpdatemenuDto);
    const payload = UpdatemenuDto;
    const insertData = [];
    const deletableIDs = [];
    const cb = async (e) => {
      deletableIDs.push(e.menu_id);
      e.children && e.children.forEach(cb);
    };
    const modifyFucntion = async (dbData: any[], role_id: number) => {
      for (let index = 0; index < dbData.length; index++) {
        const element = dbData[index];
        if (element.checked == true) {
          insertData.push({
            menu_id: element.menu_id,
            company_id: 1,
            role_id: role_id,
            created_by: userPayload.user_id,
            created_at: this.cmnFunction.cmnDatetime(),
          });
        }
        if (element.children && element.children.length != 0) {
          modifyFucntion(element.children, payload.role_id);
        }
      }
    };
    await modifyFucntion(payload.menuTree, payload.role_id);
    await payload.menuTree.forEach(cb);
    const result = await this.insertMenuPrivilege(
      deletableIDs,
      payload.role_id,
      insertData,
      userPayload,
    );
    return result;
  }
  async checkAvailableData(menu_id, role_id) {
    const result = await this.knex('sys_privilege_menus')
      .whereIn('menu_id', menu_id)
      .where({ role_id: role_id, status: 1 })
      .catch((error) => this.knexErrorService.errorMessage(error.message));
    return result;
  }
  async insertMenuPrivilege(
    deletableIDs,
    role_id,
    insertData: any[],
    userPayload: any,
  ) {
    const result = await this.knex('sys_privilege_menus')
      .whereIn('menu_id', deletableIDs)
      .where('role_id', role_id)
      .where('company_id', userPayload.company_id)
      .delete()
      .catch((error) => this.knexErrorService.errorMessage(error.message));
    if (result.length != 0 && result != undefined) {
      const result2 = this.knex('sys_privilege_menus')
        .insert(insertData)
        .catch((error) => this.knexErrorService.errorMessage(error.message));
      return result2;
    } else {
      throw new NotFoundException('Data Insertion Failed!!!');
    }
  }
}
