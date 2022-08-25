import { Inject, Injectable } from '@nestjs/common';
import { CreateDynamicJsonDto } from './dto/create-dynamic_json.dto';
import { UpdateDynamicJsonDto } from './dto/update-dynamic_json.dto';
import { DeleteDynamicJsonDto } from './dto/delete-dynamic_json.dto';
import Helpers from 'src/apsisengine/common/helpers/apsisHelper';
import { KnexErrorService } from 'src/apsisengine/common/knexerrors';
import { IdlogicService } from 'src/apsisengine/idlogic';
import { KNEX_CONNECTION } from 'src/knexmodule';
//import { SupplyChainService } from 'src/modules/supplychain/supplychain.service';
import * as fs from 'fs';

@Injectable()
export class DynamicJsonService {
  constructor(
    @Inject(KNEX_CONNECTION) private readonly knex,
    private readonly knexErrorService: KnexErrorService,
    private readonly idlogic: IdlogicService,
  //  private readonly supplyChainService: SupplyChainService,
  ) {}

  async create(request, userPayload) {
    const file_name = request.module_name.replace(' ', '_').toLowerCase();
    const file_path = `src/i18n/1/${file_name}.json`;
    delete request.module_name;
    fs.writeFile(`${file_path}`, JSON.stringify(request), function (err) {
      if (err) throw err;
      console.log('Saved!');
    });
    // const isExistFile = this.checkFileExistsSync(file_path);
    // console.log(isExistFile);
    // isExistFile
    //   ? this.Updatefile(file_path, request)
    //   : this.CreateFile(file_path, request);
  }

  async checkFileExistsSync(filepath) {
    let flag = true;
    try {
      fs.accessSync(filepath, fs.constants.F_OK);
    } catch (e) {
      flag = false;
    }
    return flag;
  }
  async Updatefile(file_path, updatedData) {
    fs.readFile(file_path, function read(err, data) {
      if (err) {
        throw err;
      }
      let file_content = data.toString();
      const readDataAsObj = JSON.parse(file_content);
      const extraProperty = {};
      Object.keys(updatedData).map((x) => {
        if (!(x in readDataAsObj)) {
          extraProperty[`${x}`] = updatedData[x];
        }
      });
      let modifyData = `${JSON.stringify(extraProperty)}`;
      modifyData = modifyData.slice(1);
      modifyData = modifyData.substring(0, modifyData.length - 1);
      modifyData = `,${modifyData}`;
      const position = file_content.length - 2;
      file_content = file_content.substring(position);
      const file = fs.openSync(file_path, 'r+');
      const bufferedText = Buffer.from(modifyData + file_content);
      fs.writeSync(file, bufferedText, 0, bufferedText.length, position);
      fs.close(file);
    });
    return true;
  }
  async CreateFile(file_path, Data) {
    fs.appendFile(`${file_path}`, JSON.stringify(Data), function (err) {
      if (err) throw err;
      console.log('Saved!');
    });
  }

  async findOne(id: string) {
    const file_path = `src/i18n/1/${id}.json`;
    const result = await fs.readFileSync(file_path);
    const file_content = result.toString();
    const readDataAsObj = JSON.parse(file_content);
    return readDataAsObj;
  }

  // async update(updatedynamicjsondto: UpdateDynamicJsonDto, userPayload, id) {
  //   const payload = updatedynamicjsondto;
  //   payload.created_by = userPayload.user_id;
  //   payload.created_at = Helpers.mysql_date();

  //   const result = await this.knex('sys_modules')
  //     .update(payload)
  //     .where('module_id', id)
  //     .catch((error) => this.knexErrorService.errorMessage(error.message));

  //   if (result === undefined || result.length === 0) {
  //     return await this.supplyChainService.returnMessageWithData(
  //       'ine',
  //       'sys_modules_update_error',
  //       'sys_modules',
  //       [],
  //     );
  //   }
  //   return await this.supplyChainService.returnMessageWithData(
  //     'ine',
  //     'sys_modules_update',
  //     'sys_modules',
  //     id,
  //   );
  // }
  // async remove(data: DeleteDynamicJsonDto, userPayload) {
  //   const userId = userPayload.user_id;
  //   const time = Helpers.mysql_date();
  //   const result = await this.knex('sys_modules')
  //     .whereIn('module_id', data.ids)
  //     .update({
  //       status: '0',
  //       deleted_by: userId,
  //       deleted_at: time,
  //     })
  //     .catch((error) => this.knexErrorService.errorMessage(error.message));
  //   if (result === undefined || result.length === 0) {
  //     return await this.supplyChainService.returnMessageWithData(
  //       'ine',
  //       'sys_modules_delete_error',
  //       'sys_modules',
  //       [],
  //     );
  //   }
  //   return await this.supplyChainService.returnMessageWithData(
  //     'ine',
  //     'sys_modules_delete',
  //     'sys_modules',
  //     data.ids,
  //   );
  // }

  async findAll() {
    const result = [];
    const dbData = await this.knex
      .select('module_id', 'module_name')
      .from('sys_modules')
      .catch((error) => this.knexErrorService.errorMessage(error.message));

    dbData.map((item) => {
      const paylod = {
        id: item.module_id,
        value: item.module_name,
        label: item.module_name,
      };
      result.push(paylod);
    });
    const data = {
      message: 'Successful',
      data: result,
    };
    return data;
  }
}
