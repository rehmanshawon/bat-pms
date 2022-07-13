import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { KnexErrorService } from 'src/apsisengine/common/knexerrors';
import { KNEX_CONNECTION } from 'src/knexmodule';
import { ConfigSlugData } from './interfaces/config-slug-data.interface';
import Helpers from 'src/apsisengine/common/helpers/apsisHelper';
import { IdlogicService } from 'src/apsisengine/idlogic';
//import { SupplyChainService } from 'src/modules/supplychain/supplychain.service';
import { CreateConfigDto } from './dto/create-config.dto';
import { DeleteConfigDto } from './dto/delete-config.dto';
import { UpdateConfigDto } from './dto/update-config.dto';

@Injectable()
export class EngineConfigService {
  constructor(
    @Inject(KNEX_CONNECTION) private readonly knex,
    private readonly knexErrorService: KnexErrorService,
   // private readonly supplyChainService: SupplyChainService,
  ) {}

  // async create(createData: CreateConfigDto[], userPayload) {
  //   createData.map(async (item) => {
  //     if (!item.config_id) {
  //       const payload = {
  //         ...item,
  //         company_id: userPayload.company_id,
  //         created_by: userPayload.user_id,
  //         created_at: Helpers.mysql_datetime(),
  //       };

  //       const result = await this.knex('sys_configs')
  //         .insert(payload, 'config_id')
  //         .catch((error) => this.knexErrorService.errorMessage(error.message));

  //       if (result === undefined || result.length === 0) {
  //         return await this.supplyChainService.returnMessageWithData(
  //           'ine',
  //           'sys_configs_create_error',
  //           'Configs',
  //           [],
  //         );
  //       }
  //     }
  //     if (item.config_id) {
  //       const { config_id, ...rest } = item;
  //       const payload = {
  //         ...rest,
  //         updated_by: userPayload.user_id,
  //         updated_at: Helpers.mysql_datetime(),
  //       };

  //       const result = await this.knex('sys_configs')
  //         .update(payload)
  //         .where('config_id', config_id)
  //         .catch((error) => this.knexErrorService.errorMessage(error.message));
  //       if (result === undefined || result.length === 0) {
  //         return await this.supplyChainService.returnMessageWithData(
  //           'ine',
  //           'sys_configs_update_error',
  //           'Configs',
  //           [],
  //         );
  //       }
  //     }
  //   });

  //   return await this.supplyChainService.returnMessageWithData(
  //     'ine',
  //     'sys_configs_create',
  //     'Configs',
  //     null,
  //   );
  // }

  // async findOne(id: number) {
  //   const data = await this.knex('sys_configs')
  //     .where({
  //       config_id: id,
  //       status: '1',
  //     })
  //     .first()
  //     .catch((error) => this.knexErrorService.errorMessage(error.message));
  //   if (data === undefined || data.length === 0) {
  //     return await this.supplyChainService.returnMessageWithData(
  //       'ine',
  //       'sys_configs_get_error',
  //       'Configs',
  //       [],
  //     );
  //   }
  //   return await this.supplyChainService.returnMessageWithData(
  //     'ine',
  //     'sys_configs_get',
  //     'Configs',
  //     data,
  //   );
  // }

  // async getSlugs(userPayload) {
  //   const data = await this.knex('sys_configs')
  //     .select('config_slug')
  //     .distinct('config_slug')
  //     .where({
  //       company_id: userPayload.company_id,
  //       status: '1',
  //     })
  //     .catch((error) => this.knexErrorService.errorMessage(error.message));
  //   if (data === undefined || data.length === 0) {
  //     return await this.supplyChainService.returnMessageWithData(
  //       'ine',
  //       'sys_configs_get_error',
  //       'Configs',
  //       [],
  //     );
  //   }
  //   const result = data.map((slug) => slug.config_slug);
  //   return await this.supplyChainService.returnMessageWithData(
  //     'ine',
  //     'sys_configs_get',
  //     'Configs',
  //     result,
  //   );
  // }

  // async update(updateconfigdto: UpdateConfigDto, userPayload, id) {
  //   const payload = updateconfigdto;
  //   payload.updated_by = userPayload.user_id;
  //   payload.updated_at = Helpers.mysql_datetime();

  //   const result = await this.knex('sys_configs')
  //     .update(payload)
  //     .where('config_id', id)
  //     .catch((error) => this.knexErrorService.errorMessage(error.message));

  //   if (result === undefined || result.length === 0) {
  //     return await this.supplyChainService.returnMessageWithData(
  //       'ine',
  //       'sys_configs_update_error',
  //       'Configs',
  //       [],
  //     );
  //   }
  //   return await this.supplyChainService.returnMessageWithData(
  //     'ine',
  //     'sys_configs_update',
  //     'Configs',
  //     id,
  //   );
  // }

  // async remove(data: DeleteConfigDto, userPayload) {
  //   const userId = userPayload.user_id;
  //   const result = await this.knex('sys_configs')
  //     .whereIn('config_id', data.ids)
  //     .update({
  //       status: '0',
  //       deleted_by: userId,
  //       deleted_at: Helpers.mysql_datetime(),
  //     })
  //     .catch((error) => this.knexErrorService.errorMessage(error.message));
  //   if (result === undefined || result.length === 0) {
  //     return await this.supplyChainService.returnMessageWithData(
  //       'ine',
  //       'sys_configs_delete_error',
  //       'Configs',
  //       [],
  //     );
  //   }
  //   return await this.supplyChainService.returnMessageWithData(
  //     'ine',
  //     'sys_configs_delete',
  //     'Configs',
  //     data.ids,
  //   );
  // }

  //get data by config slug
  // async lookupSlug(slug: string, company_id: number) {
  //   const slug_data: ConfigSlugData = await this.knex('sys_configs')
  //     .select(
  //       'config_id',
  //       'config_slug',
  //       'config_key',
  //       'config_value',
  //       'module_id',
  //     )
  //     .where('config_slug', slug)
  //     .where('company_id', company_id)
  //     .where('status', 1)
  //     .catch((error) => this.knexErrorService.errorMessage(error.message));

  //   if (!slug_data) {
  //     return await this.supplyChainService.returnMessageWithData(
  //       'ine',
  //       'sys_configs_get_error',
  //       'Configs',
  //       [],
  //     );
  //   }

  //   return await this.supplyChainService.returnMessageWithData(
  //     'ine',
  //     'sys_configs_get',
  //     'Configs',
  //     slug_data,
  //   );
  // }

  //get data by config key
  async lookupKey(config_key: string, company_id) {
    const key_data = await this.knex('sys_configs')
      .select('config_value')
      .where('config_key', config_key)
      .where('company_id', company_id)
      .where('status', 1)
      .first()
      .catch((error) => this.knexErrorService.errorMessage(error.message));

    if (!key_data) {
      throw new NotFoundException('config key not found!');
    }

    return key_data.config_value;
  }
}
