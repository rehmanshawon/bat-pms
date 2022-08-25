/* eslint-disable @typescript-eslint/no-var-requires */
import Helpers from './apsisHelper';

//Generate Primary key
export function GeneratePrimaryKey(table_schemas) {
  let key: any;
  table_schemas.map((item) => {
    if (item.COLUMN_KEY === 'PRI') {
      key = item.column_name;
    }
  });
  return key;
}
//Generate table name code
export function GenerateTableNameCode(table, table_schema) {
  let startIndex;
  for (let i = table.length; i > 0; i--) {
    if (table[i] === '_') {
      startIndex = i + 1;
      break;
    }
  }
  const lastIndex =
    table[table.length - 1] === 's' ? table.length - 1 : table.length;
  const table_code = table.slice(startIndex, lastIndex) + '_code';
  let tableCodeExist = false;
  for (let i = 0; i < table_schema.length; i++) {
    if (table_schema[i].column_name === table_code) {
      tableCodeExist = true;
    }
  }
  return tableCodeExist ? table_code : '';
}
//DTO prepare start by using table schema
export function makeDto(table_schemas, table_code, primary_key, checksField) {
  let dtoSchema = '';
  table_schemas.map((item) => {
    // console.log(item);
    // console.log('............');
    if (
      item.column_name !== primary_key &&
      item.column_name !== 'updated_at' &&
      item.column_name !== 'updated_by' &&
      item.column_name !== 'deleted_at' &&
      item.column_name !== 'deleted_by' &&
      item.column_name !== 'status'
    ) {
      const name = item.column_name;
      const type = typeCheck(item.udt_name);
      const typeAndLength = typeDecorator(
        item.udt_name,
        item.character_maximum_length,
      );
      let nullcheck;
      if (
        item.column_name !== 'created_at' ||
        item.column_name !== 'created_by' ||
        item.column_name !== 'company_id'
      ) {
        nullcheck =
          item.is_nullable === 'NO'
            ? '\n\t@ApiProperty()'
            : '\n\t@ApiPropertyOptional()' + '\n\t@IsOptional()';
      }
      if (
        item.column_name === 'created_at' ||
        item.column_name === 'created_by' ||
        item.column_name === 'company_id' ||
        item.column_name === table_code
      ) {
        nullcheck = '\n\t@IsOptional()';
      }
      //enum field check
      let enumvaliDation;
      if (item.udt_name === 'text') {
        enumvaliDation = enumvaliDationGenerator(item.column_name, checksField);
      }
      //decimal type validation
      let decimalValiDation;
      if (item.udt_name === 'numeric' || item.udt_name === 'float') {
        decimalValiDation = decimalValiDationGenerator(
          item.numeric_precision,
          item.numeric_scale,
          item.udt_name,
        );
      }
      const last = `${name}` + ': ' + `${type};`;
      dtoSchema +=
        nullcheck +
        (enumvaliDation ? enumvaliDation : '') +
        (decimalValiDation ? decimalValiDation : '') +
        (typeAndLength ? typeAndLength : '') +
        last +
        '\n';
    }
  });
  return dtoSchema;
}

//check company id exist or not
export function checkCompanyId(table_schema) {
  let result = false;
  table_schema.map((item) => {
    if (item.column_name === 'company_id') {
      result = true;
    }
  });
  return result;
}
function typeCheck(type) {
  // hash table for type check
  const typetable = {
    varchar: 'string',
    text: 'string',
    int: 'number',
    float: 'number',
    decimal: 'number',
    tinyint: 'number',
    smallint: 'number',
    int4: 'number',
    int8: 'number',
    int2: 'number',
    float4: 'number',
    numeric: 'number',
    timestamptz: 'Date',
    datetime: 'Date',
    date: 'Date',
    timestamp: 'Date',
    enum: 'string',
  };
  return typetable[type];
}
function typeDecorator(type, length) {
  //hash table for type decorator
  let typeAndlength = '';
  const typetable = {
    varchar: '@IsString()',
    text: '@IsString()',
    int: '@IsInt()',
    int2: '@IsInt()',
    int4: '@IsInt()',
    int8: '@IsInt()',
    float2: '@IsInt()',
    flaot4: '@IsInt()',
    smallint: '@IsInt()',
    datetime: '@IsDate()',
    timestamptz: '@IsDate()',
    timestamp: '@IsDate()',
    enum: '@IsString()',
  };
  typeAndlength = length
    ? `\n\t${typetable[type] ? typetable[type] : ''}` +
      `\n\t@MaxLength(${length})\n\t`
    : `\n\t${typetable[type] ? typetable[type] : ''}`;
  return typeAndlength;
}

//enum validation generator
function enumvaliDationGenerator(column_name, checksField) {
  const checkColumn = `((${column_name}`;
  let checkSlug = '';
  checksField.map((item) => {
    if (item.check_clause.includes(checkColumn)) {
      checkSlug = item.check_clause;
    }
  });
  const value = checkSlug.length > 0 ? arrayValueGenerate(checkSlug) : '';
  const schema = `\n\t@ValidateIf((o) => o.${column_name} !== '')\n\t@IsIn([${value}])`;
  const result = value.length > 0 ? schema : '';
  return result;
}
//decimal validation generator
function decimalValiDationGenerator(
  numeric_precision,
  numeric_scale,
  udt_name,
) {
  //converting string to array of number;

  let beforeDecimalMax = '';
  let afterDecimalMax = '';
  let afterDecimalMin = '';
  for (let i = 0; i < numeric_precision; i++) {
    beforeDecimalMax += '9';
  }
  for (let i = 0; i < numeric_scale; i++) {
    afterDecimalMax += '9';
    afterDecimalMin += '0';
  }
  const maxNumber = beforeDecimalMax + '.' + afterDecimalMax;
  const minNumber = '0.' + afterDecimalMin;
  const result = `\n\t@IsNumber({ maxDecimalPlaces: ${numeric_scale} })\n\t@Min(${minNumber})\n\t@Max(${maxNumber})`;
  return result;
}
//Class name generator
function toUpperCamelCase(params: string) {
  const subStr = params.split(new RegExp(/[-_ ]+/, 'g'));
  return subStr.map((str) => str[0].toUpperCase() + str.slice(1)).join('');
}

//DTO file generate
export async function CreatedtoFileGenerator(dtoPath, dto, dtoSchema) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const fs = require('fs').promises;
  await fs
    .writeFile(
      `${dtoPath}/create-${dto}.dto.ts`,
      'import { ApiProperty } from "@nestjs/swagger";' +
        '\nimport { IsString } from "class-validator";' +
        `\n\nexport class Create${toUpperCamelCase(dto)}Dto {\n` +
        `${dtoSchema}` +
        '\n}',
      function (err) {
        if (err) return console.log(err);
      },
    )
    .then(() => {
      console.log('dto write success');
    });
}

//Update DTO file generate
export async function UpdatedtoFileGenerator(dtoPath, dto) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const fs = require('fs').promises;
  // const dtoName = dto[0].toUpperCase() + dto.slice(1);
  await fs
    .writeFile(
      `${dtoPath}/update-${dto}.dto.ts`,
      'import { PartialType } from "@nestjs/swagger";' +
        `\nimport { Create${toUpperCamelCase(
          dto,
        )}Dto} from './create-${dto}.dto';` +
        `\n\nexport class Update${toUpperCamelCase(
          dto,
        )}Dto extends PartialType(Create${toUpperCamelCase(dto)}Dto) {
          updated_at: Date;
          updated_by: number;
        }`,
      function (err) {
        if (err) return console.log(err);
      },
    )
    .then(() => {
      console.log('dto created successfully!');
    });
}

//Delete DTO file Generator
export async function DeletedtoFileGenerator(dtoPath, dto) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const fs = require('fs').promises;
  // const dtoName = dto[0].toUpperCase() + dto.slice(1);
  await fs
    .writeFile(
      `${dtoPath}/delete-${dto}.dto.ts`,
      'import { ApiProperty } from "@nestjs/swagger";\n' +
        'import { IsArray } from "class-validator";\n' +
        `\n\nexport class Delete${toUpperCamelCase(dto)}Dto {\n` +
        `@ApiProperty({ type: [Number] })
        @IsArray()
        ids: number[];` +
        '\n}',
      function (err) {
        if (err) return console.log(err);
      },
    )
    .then(() => {
      console.log('Delete dto created successfully!');
    });
}
// Controller Generate
export async function ControllerGenerator(
  controllerPath,
  controller,
  company_id,
) {
  const serviceName = `${toUpperCamelCase(controller)}` + 'Service';
  let serviceInstance = `${toUpperCamelCase(controller)}` + 'Service';
  serviceInstance = serviceInstance[0].toLowerCase() + serviceInstance.slice(1);
  const controllerName = `${toUpperCamelCase(controller)}` + 'Controller';
  const dtoName = `Create${toUpperCamelCase(controller)}Dto`;
  const updateDto = `Update${toUpperCamelCase(controller)}Dto`;
  const deleteDto = `Delete${toUpperCamelCase(controller)}Dto`;
  const dtoInstance = dtoName.toLowerCase(); //`${dtoName[0].toLowerCase()}${controller.slice(1)}`;
  const updateDtoInstance = updateDto.toLocaleLowerCase();
  // const deleteDtoInstance = updateDto.toLocaleLowerCase();
  // const companyIdutils = company_id
  //   ? `import { CompanyId } from 'src/apsisengine/utils/decorator/company-id.decorator';`
  //   : '';
  // const companyDecorator = company_id ? `@CompanyId() companyId: number,` : '';
  // const companyidPayload = company_id ? `payload.company_id = companyId;` : '';
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const fs = require('fs').promises;
  await fs
    .writeFile(
      `${controllerPath}`,
      `import {
          Controller,
          Get,
          Post,
          Body,
          Patch,
          Param,
          UseGuards,
        } from '@nestjs/common';
        import { ${serviceName} } from './${controller}.service';
        import { ${dtoName} } from './dto/create-${controller}.dto';
        import { ${updateDto} } from './dto/update-${controller}.dto';
        import { ${deleteDto} } from './dto/delete-${controller}.dto';
        import { UserPayload } from 'src/apsisengine/utils/decorator';
        import { JwtPayloadInterface } from 'src/apsisengine/auth/interfaces';
        import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
        import { JwtAuthGuard } from 'src/apsisengine/auth/guards';

        @ApiTags('${controller}')
        @ApiBearerAuth('jwt')
        @UseGuards(JwtAuthGuard)
        @Controller({
          path: '${controller}',
          version: '1',
        })
        export class ${controllerName} {
          constructor(private readonly ${serviceInstance}: ${serviceName}) {}
          @ApiOperation({
            summary: 'create a new ${controller}',
            description: 'this ${controller} api is responsible for creating a ${controller} by post request. to make post request check json format properly',
          })
          @Post()
          async create(
            @Body() ${dtoInstance}: ${dtoName},
            @UserPayload() userPayload: JwtPayloadInterface,
            ) {
              const data = await this.${serviceInstance}.create( ${dtoInstance}, userPayload);
              return { message: data.message, result: data.data }
          }
          @ApiOperation({
            summary: 'Show a single ${controller}',
            description: 'this ${controller} api is responsible for fetching a ${controller} from database',
          })
          @Get(':id')
          async findOne(@Param('id') id: number) {
            const data = await this.${serviceInstance}.findOne(+id);
            return { message: data.message, result: data.data }
          }

          @ApiOperation({
            summary: 'Delete a ${controller}',
            description: 'this ${controller} api is responsible for deleting a ${controller} by corresponding id.',
          })
          @Patch('/delete')
          async remove(@Body() ids: ${deleteDto},  @UserPayload() userPayload: JwtPayloadInterface) {
            const data = await this.${serviceInstance}.remove(ids, userPayload);
            return { message: data.message, result: data.data }
          }


          @ApiOperation({
            summary: 'Update a ${controller}',
            description: 'this ${controller} api is responsible for updating a ${controller} by patch request. to make patch request check json format properly',
          })
          @Patch(':id')
          async update(
            @Param('id') id: number,
            @Body() ${updateDtoInstance}: ${updateDto},
            @UserPayload() userPayload: JwtPayloadInterface,
          ) {
            const data = await this.${serviceInstance}.update( ${updateDtoInstance}, userPayload,id);
            return { message: data.message, result: data.data }
          }
        }
        `,
      function (err) {
        if (err) return console.log(err);
      },
    )
    .then(() => {
      console.log('Controller created successfully!');
    });
}

//Service Generator
export async function ServiceGenerator(
  servicePath,
  service,
  table,
  primaryKey,
  table_code,
  module,
) {
  const serviceName = `${toUpperCamelCase(service)}` + 'Service';
  const dtoName = `Create${toUpperCamelCase(service)}Dto`;
  const dtoInstance = dtoName.toLowerCase(); //`${dtoName[0].toLowerCase()}${table.slice(1)}`;
  const updateDto = `Update${toUpperCamelCase(service)}Dto`;
  const deleteDto = `Delete${toUpperCamelCase(service)}Dto`;
  const updateDtoInstance = updateDto.toLocaleLowerCase();

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const fs = require('fs').promises;
  await fs
    .writeFile(
      `${servicePath}`,
      `
        import { Inject, Injectable } from '@nestjs/common';
        import { ${dtoName} } from './dto/create-${service}.dto';
        import { ${updateDto} } from './dto/update-${service}.dto';
        import { ${deleteDto} } from './dto/delete-${service}.dto';
        import Helpers from 'src/apsisengine/common/helpers/apsisHelper';
        import { KnexErrorService } from 'src/apsisengine/common/knexerrors';
        import { IdlogicService } from 'src/apsisengine/idlogic';
        import { KNEX_CONNECTION } from 'src/knexmodule';
        import { SupplyChainService } from 'src/modules/supplychain/supplychain.service';

        @Injectable()
        export class ${serviceName} {
          constructor(
            @Inject(KNEX_CONNECTION) private readonly knex,
            private readonly knexErrorService: KnexErrorService,
            private readonly idlogic: IdlogicService,
            private readonly supplyChainService: SupplyChainService,
          ) {}
  
          async create(${dtoInstance}: ${dtoName},userPayload) {
            ${dtoInstance}.company_id = userPayload.company_id;
            ${
              table_code.length > 0
                ? `
                const tableNameCode = '${table_code}';
                if (tableNameCode.length !== 0 || tableNameCode !== undefined) {
              if (
                ${dtoInstance}.${table_code} === '' ||
                ${dtoInstance}.${table_code} === undefined
              ) {
                const idlogicData = {
                  slug: '${table_code}',
                  companyId: ${dtoInstance}.company_id,
                  date: null,
                  data: {
                    // BR: 20,
                  },
                };
                const data = await this.idlogic.generateId(idlogicData);
                ${dtoInstance}.${table_code} = data;
              }
            }`
                : ''
            }
            const payload = ${dtoInstance};
            payload.created_by = userPayload.user_id;
            payload.created_at = Helpers.mysql_datetime();

            const result = await this.knex('${table}')
              .insert(payload,'${primaryKey}')
              .catch((error) => this.knexErrorService.errorMessage(error.message));
      
              if (result === undefined || result.length === 0) {
                return await this.supplyChainService.returnMessageWithData(
                  '${module}',
                  '${table}_create_error',
                  '${tableNameFormater(table)}',
                  [],
                );
              }
              return await this.supplyChainService.returnMessageWithData(
                '${module}',
                '${table}_create',
                '${tableNameFormater(table)}',
                result[0],
              );
          }
  
          async findOne(id: number) {
            const data = await this.knex('${table}')
            .where({
              '${primaryKey}': id,
              status: '1',
            }).first()
            .catch((error) => this.knexErrorService.errorMessage(error.message));
             if (data === undefined || data.length === 0 ) {
              return await this.supplyChainService.returnMessageWithData(
                '${module}',
                '${table}_get_error',
                '${tableNameFormater(table)}',
                [],
              );
            }
            return await this.supplyChainService.returnMessageWithData(
              '${module}',
              '${table}_get',
              '${tableNameFormater(table)}',
              data,
            );
          }

          async update(${updateDtoInstance}: ${updateDto}, userPayload, id) {

            const payload = ${updateDtoInstance};
            payload.updated_by = userPayload.user_id;
            payload.updated_at = Helpers.mysql_datetime();

            const result = await this.knex('${table}')
              .update(payload)
              .where('${primaryKey}', id)
              .catch((error) => this.knexErrorService.errorMessage(error.message));

             if (result === undefined || result.length === 0) {
              return await this.supplyChainService.returnMessageWithData(
                '${module}',
                '${table}_update_error',
                '${tableNameFormater(table)}',
                [],
              );
            }
            return await this.supplyChainService.returnMessageWithData(
              '${module}',
              '${table}_update',
              '${tableNameFormater(table)}',
              id,
            );
          }
          async remove(data: ${deleteDto}, userPayload) {
            const userId = userPayload.user_id;
            const result = await this.knex('${table}')
              .whereIn('${primaryKey}', data.ids)
              .update({
                status: '0',
                deleted_by: userId,
                deleted_at: Helpers.mysql_datetime(),
              })
              .catch((error) => this.knexErrorService.errorMessage(error.message));
              if (result === undefined || result.length === 0) {
                return await this.supplyChainService.returnMessageWithData(
                  '${module}',
                  '${table}_delete_error',
                  '${tableNameFormater(table)}',
                  [],
                );
              }
              return await this.supplyChainService.returnMessageWithData(
                '${module}',
                '${table}_delete',
                '${tableNameFormater(table)}',
                data.ids,
              );
          }
        }
        `,
      function (err) {
        if (err) return console.log(err);
      },
    )
    .then(() => {
      console.log('service created successfully!');
    });
}

//Generate Form column for sys_form table
export function generateFormColumn(slug_name, form_titles) {
  const form_slug = slug_name;
  const form_title = form_titles;
  const formPayload: any = {};
  formPayload.form_slug = form_slug;
  formPayload.form_title = form_title;
  formPayload.created_by = 1;
  formPayload.status = 1;
  formPayload.company_id = 1;
  formPayload.created_at = Helpers.mysql_date();
  return formPayload;
  // console.log(formPayload);
}
//Generate Form elements column for sys_forms_elements
export async function generateFormElement(
  table_schema,
  slug_name,
  table_name,
  primaryKey,
  foreignKeys,
  checksField,
) {
  const form_slug = slug_name;
  const Elements = [];
  let sortNumber = 1;
  const enumField = await makeEnum(checksField);
  table_schema.map((item) => {
    if (
      item.column_name !== primaryKey &&
      item.column_name !== 'updated_at' &&
      item.column_name !== 'updated_by' &&
      item.column_name !== 'deleted_at' &&
      item.column_name !== 'deleted_by' &&
      item.column_name !== 'status' &&
      item.column_name !== 'created_at' &&
      item.column_name !== 'created_by' &&
      item.column_name !== 'company_id'
    ) {
      const obj: any = {};
      obj.form_slug = form_slug;
      obj.form_element_section = 'sec_1';
      obj.element_column = 4;
      const lable = item.column_name.replace(/_/g, ' ');
      const s = lable[lable.length - 2] + lable[lable.length - 1];
      obj.label_name =
        s === 'id'
          ? makeCapital(lable.slice(0, lable.length - 3))
          : makeCapital(lable);
      obj.input_type = foreignKeys.includes(item.column_name)
        ? 'select'
        : enumField.includes(item.column_name)
        ? 'dropdown'
        : columnType(item.udt_name);
      obj.input_name = item.column_name;
      obj.multiple = 0;
      obj.input_placeholder = makeCapital(item.column_name.replace(/_/g, ' '));
      obj.input_id = item.column_name;
      obj.input_class = 'form_control';
      obj.element_class = 'col-md-8';
      obj.dropdown_options = enumField.includes(item.column_name)
        ? makeDropdown(item.column_name, checksField)
        : null;
      obj.sort_number = sortNumber++;
      obj.disabled = 0;
      obj.required = item.is_nullable === 'NO' ? 1 : 0;
      obj.validation_rules = validationGenerate(item);
      obj.created_by = 1;
      obj.created_at = Helpers.mysql_date();
      obj.status = 1;
      obj.company_id = 1;
      Elements.push(obj);
    }
  });
  const result = await tableCode(table_name, Elements);
  return result;
}
//column type check for form element
function columnType(type) {
  // hash table for type check
  const typetable = {
    varchar: 'text',
    text: 'textarea',
    longtext: 'textarea',
    int: 'number',
    float: 'number',
    decimal: 'number',
    tinyint: 'number',
    smallint: 'number',
    numeric: 'number',
    int2: 'number',
    int4: 'number',
    int8: 'number',
    float2: 'number',
    float4: 'number',
    bool: 'checkbox',
    datetime: 'date',
    date: 'date',
    timestamp: 'date',
    enum: 'select',
  };
  return typetable[type];
}
//make dropdown list
function makeDropdown(column_name, checksField) {
  const checkColumn = `((${column_name}`;
  let checkSlug = '';
  checksField.map((item) => {
    if (item.check_clause.includes(checkColumn)) {
      checkSlug = item.check_clause;
    }
  });
  const value = checkSlug.length > 0 ? arrayValueGenerate(checkSlug) : '';
  const temp = value.replace(/['"]+/g, '');
  const valueArray = temp.split(',');
  const dropdown = [];
  valueArray.map((item) => {
    const obj: any = {};
    obj.label = item;
    obj.value = item;
    dropdown.push(obj);
  });
  return JSON.stringify(dropdown);
}
function makeCapital(mySentence) {
  const str = mySentence;
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  const caps = str.split(' ').map(capitalize).join(' ');
  return caps;
}

//generate validationRules
function validationGenerate(item) {
  let validationRules = '[';
  if (item.udt_name) {
    validationRules += `{type: ${typeCheck(
      item.udt_name,
    )}, message: Must be type of ${typeCheck(item.udt_name)}}`;
  }
  if (item.is_nullable === 'NO') {
    validationRules += `,{required: true, message: 'Please input ${item.column_name}' }`;
  }
  if (item.character_maximum_length) {
    validationRules += `,
    {max: ${item.character_maximum_length},message: '${item.column_name} can be maximum ${item.character_maximum_length} characters.'}`;
  }
  validationRules += ']';
  return validationRules;
}

//function table_code generate
async function tableCode(table, elements) {
  let startIndex;
  for (let i = table.length; i > 0; i--) {
    if (table[i] === '_') {
      startIndex = i + 1;
      break;
    }
  }
  const lastIndex =
    table[table.length - 1] === 's' ? table.length - 1 : table.length;
  const table_code = table.slice(startIndex, lastIndex) + '_code';

  const filtered = elements.filter(function (el) {
    return el.input_name !== table_code;
  });
  const result = filtered.filter(function (el) {
    return el.input_name !== 'status_flow_id';
  });
  return result;
}

//message file generate for Dynamic message and response
export async function messageFileGenerator(messageFolder, messageFile, table) {
  const filePath = `${messageFolder}/${messageFile}`;
  const isExistFile = checkFileExistsSync(filePath);
  isExistFile ? Updatefile(filePath, table) : CreateFile(filePath, table);
}

function checkFileExistsSync(filepath) {
  const fs = require('fs');
  let flag = true;
  try {
    fs.accessSync(filepath, fs.constants.F_OK);
  } catch (e) {
    flag = false;
  }
  return flag;
}

async function CreateFile(filepath, table) {
  const fs = require('fs');
  const emptyData = `{
    "${table}_create": "{code} Successfully Created!!",
    "${table}_create_error": "Error Found!!!! {code} table data not insert",
    "${table}_get": "Successfull retrieve {code} Data!!!",
    "${table}_get_error": "Error Found!!!! {code} table data not found!",
    "${table}_update": "Successfull Update {code} Data!!!",
    "${table}_update_error": "Error Found!!!! {code} table data not update!",
    "${table}_delete": "Successfull deleted {code} Data!!!",
    "${table}_delete_error": "Error Found!!!! {code} table data not deleted!"
  }`;
  fs.writeFileSync(filepath, emptyData);
}

async function Updatefile(filePath, table) {
  const updatedData = `,

    "${table}_create": "{code} Successfully Created!!",
    "${table}_create_error": "Error Found!!!! {code} table data not insert",
    "${table}_get": "Successfull retrieve {code} Data!!!",
    "${table}_get_error": "Error Found!!!! {code} table data not update!",
    "${table}_update": "Successfull Update {code} Data!!!",
    "${table}_update_error": "Error Found!!!! {code} table data not update!",
    "${table}_delete": "Successfull deleted {code} Data!!!",
    "${table}_delete_error": "Error Found!!!! {code} table data not Deleted!"
  `;
  const fs = require('fs');
  fs.readFile(filePath, function read(err, data) {
    if (err) {
      throw err;
    }
    let file_content = data.toString();
    const position = file_content.length - 2;
    file_content = file_content.substring(position);
    const file = fs.openSync(filePath, 'r+');
    const bufferedText = Buffer.from(updatedData + file_content);
    fs.writeSync(file, bufferedText, 0, bufferedText.length, position);
    fs.close(file);
  });
  return true;
}

export function makeModule(module) {
  let result = '';
  const end = module.length - 1;
  for (let current = 8; current < end; current++) {
    if (module[current] === '/') {
      break;
    } else {
      result += module[current];
    }
  }
  return result;
}
function arrayValueGenerate(str) {
  let result = '';
  for (let i = 0; i < str.length; i++) {
    if (str[i].charCodeAt(0) == 39) {
      let localString = '';
      localString += str[i];
      for (let j = i + 1; j < str.length; j++) {
        localString += str[j];
        if (str[j].charCodeAt(0) == 39) {
          localString += ',';
          i = j + 1;
          break;
        }
      }
      result += localString;
      localString = '';
    }
  }
  return result.slice(0, -1);
}

//enum field generate
async function makeEnum(checkfield) {
  const list = [];
  checkfield.map((item) => {
    if (item.check_clause[1] === '(') {
      const str = item.check_clause;
      list.push(str.slice(2, str.indexOf('=') - 1));
    }
  });
  return list;
}

function tableNameFormater(table: string) {
  return table
    .split('_')
    .splice(1)
    .map((item) => {
      return [item[0].toUpperCase(), item.slice(1)].join('');
    })
    .join(' ');
}
