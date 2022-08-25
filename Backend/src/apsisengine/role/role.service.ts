import { Inject, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { DeleteRoleDto } from './dto/delete-role.dto';
import Helpers from 'src/apsisengine/common/helpers/apsisHelper';
import { KnexErrorService } from 'src/apsisengine/common/knexerrors';
import { IdlogicService } from 'src/apsisengine/idlogic';
import { KNEX_CONNECTION } from 'src/knexmodule';
//import { SupplyChainService } from 'src/modules/supplychain/supplychain.service';

@Injectable()
export class RoleService {
  constructor(
    @Inject(KNEX_CONNECTION) private readonly knex,
    private readonly knexErrorService: KnexErrorService,
    private readonly idlogic: IdlogicService,
   // private readonly supplyChainService: SupplyChainService,
  ) {}

  // async create(createroledto: CreateRoleDto, userPayload) {
  //   createroledto.company_id = userPayload.company_id;

  //   const payload = createroledto;
  //   payload.created_by = userPayload.user_id;
  //   payload.created_at = Helpers.mysql_datetime();

  //   const result = await this.knex('sys_roles')
  //     .insert(payload, 'role_id')
  //     .catch((error) => this.knexErrorService.errorMessage(error.message));

  //   if (result === undefined || result.length === 0) {
  //     return await this.supplyChainService.returnMessageWithData(
  //       'ine',
  //       'sys_roles_create_error',
  //       'Roles',
  //       [],
  //     );
  //   }
  //   return await this.supplyChainService.returnMessageWithData(
  //     'ine',
  //     'sys_roles_create',
  //     'Roles',
  //     result[0],
  //   );
  // }

  // async findOne(id: number) {
  //   const data = await this.knex
  //     .select('sys_roles.*', 'sys_modules.module_name')
  //     .from('sys_roles')
  //     .where({
  //       role_id: id,
  //       'sys_roles.status': '1',
  //     })
  //     .leftJoin('sys_modules', 'sys_roles.module_id', 'sys_modules.module_id')
  //     .first()
  //     .catch((error) => this.knexErrorService.errorMessage(error.message));
  //   if (data === undefined || data.length === 0) {
  //     return await this.supplyChainService.returnMessageWithData(
  //       'ine',
  //       'sys_roles_get_error',
  //       'Roles',
  //       [],
  //     );
  //   }
  //   return await this.supplyChainService.returnMessageWithData(
  //     'ine',
  //     'sys_roles_get',
  //     'Roles',
  //     data,
  //   );
  // }

  // async update(updateroledto: UpdateRoleDto, userPayload, id) {
  //   const payload = updateroledto;
  //   payload.updated_by = userPayload.user_id;
  //   payload.updated_at = Helpers.mysql_datetime();

  //   const result = await this.knex('sys_roles')
  //     .update(payload)
  //     .where('role_id', id)
  //     .catch((error) => this.knexErrorService.errorMessage(error.message));

  //   if (result === undefined || result.length === 0) {
  //     return await this.supplyChainService.returnMessageWithData(
  //       'ine',
  //       'sys_roles_update_error',
  //       'Roles',
  //       [],
  //     );
  //   }
  //   return await this.supplyChainService.returnMessageWithData(
  //     'ine',
  //     'sys_roles_update',
  //     'Roles',
  //     id,
  //   );
  // }
  // async remove(data: DeleteRoleDto, userPayload) {
  //   const userId = userPayload.user_id;
  //   const result = await this.knex('sys_roles')
  //     .whereIn('role_id', data.ids)
  //     .update({
  //       status: '0',
  //       deleted_by: userId,
  //       deleted_at: Helpers.mysql_datetime(),
  //     })
  //     .catch((error) => this.knexErrorService.errorMessage(error.message));
  //   if (result === undefined || result.length === 0) {
  //     return await this.supplyChainService.returnMessageWithData(
  //       'ine',
  //       'sys_roles_delete_error',
  //       'Roles',
  //       [],
  //     );
  //   }
  //   return await this.supplyChainService.returnMessageWithData(
  //     'ine',
  //     'sys_roles_delete',
  //     'Roles',
  //     data.ids,
  //   );
  // }
}
