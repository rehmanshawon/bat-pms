import { Inject, Injectable } from '@nestjs/common';
import { _cli } from '@squareboat/nest-console';
import { KnexErrorService } from 'src/apsisengine/common/knexerrors';
import { IdlogicService } from 'src/apsisengine/idlogic';
import { KNEX_CONNECTION } from 'src/knexmodule';
import {
  ControllerGenerator,
  CreatedtoFileGenerator,
  UpdatedtoFileGenerator,
  makeDto,
  makeModule,
  ServiceGenerator,
  checkCompanyId,
  GenerateTableNameCode,
  generateFormColumn,
  generateFormElement,
  DeletedtoFileGenerator,
  messageFileGenerator,
} from 'src/apsisengine/common/helpers/cliGeneratorForPostgresql';

@Injectable()
export class CliService {
  constructor(
    @Inject(KNEX_CONNECTION) private readonly knex,
    private readonly knexErrorService: KnexErrorService,
    private readonly idlogic: IdlogicService,
  ) {}

  async crudGenerator() {
    const result = await this.tablescheam();
    const table = result[0];
    const table_schema = result[1];
    const dtoControllerAndServiceName = await _cli.ask(
      'use a common name for dto,controller and service: ',
    );
    const dto =
      dtoControllerAndServiceName === '' ? table : dtoControllerAndServiceName;

    const controller =
      dtoControllerAndServiceName === '' ? table : dtoControllerAndServiceName;

    const service =
      dtoControllerAndServiceName === '' ? table : dtoControllerAndServiceName;

    let moduleName;
    let pathError = true;
    do {
      moduleName = await _cli.ask('Enter folder path name:');
      if (moduleName) {
        pathError = false;
      } else {
        pathError = true;
        _cli.info('path can not be blank');
      }
    } while (pathError);

    if (table && moduleName) {
      const pathTest = moduleName.charAt(moduleName.length - 1);
      const path =
        pathTest === '/' ? `src/${moduleName}/${table}` : `src/${moduleName}`;
      const table_code = await GenerateTableNameCode(table, table_schema);
      const primarykey = await this.primaryKeyOfTable(table);
      const checksField = await this.checkFieldGenerate(table);
      const dtoSchema = await makeDto(
        table_schema,
        table_code,
        primarykey,
        checksField,
      ); //await this.makeDto(table_schemas);
      const company_id = await checkCompanyId(table_schema);
      const dtoPath = `${path}/dto/`;
      const controllerPath = `${path}/${controller}.controller.ts`;
      const servicePath = `${path}/${service}.service.ts`;
      const messageFolder = 'src/i18n/1';
      const module = makeModule(moduleName);
      const messageFile = `${module}.json`;
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const fs = require('fs').promises;
      await fs.mkdir(dtoPath, { recursive: true });
      await fs.mkdir(messageFolder, { recursive: true });
      await messageFileGenerator(messageFolder, messageFile, table);
      await CreatedtoFileGenerator(dtoPath, dto, dtoSchema);
      await UpdatedtoFileGenerator(dtoPath, dto);
      await DeletedtoFileGenerator(dtoPath, dto);
      await ControllerGenerator(controllerPath, controller, company_id);
      await ServiceGenerator(
        servicePath,
        service,
        table,
        primarykey,
        table_code,
        module,
      );
      await _cli.info('Successfully created. Thank you!\n');
      const choice = await _cli.select(
        'Do you really want to make form element?',
        ['yes', 'no'],
        false,
      );
      if (choice === 'yes') {
        await this.formElement(table, table_schema);
      } else {
        return;
      }
    }
  }
  async formElement(table_name = 1, is_schema = 0) {
    let table = 'testing_table';
    let table_schema = is_schema;
    if (is_schema === 0) {
      const data = await this.tablescheam();
      table = data[0];
      table_schema = data[1];
    }
    let slug_error = true;
    //check given slug is already exist in database then take another slug name
    do {
      const form_slug = await _cli.ask('create a slug_name: ');
      const check_slug = await this.checkSlug(form_slug);
      let slug_name = form_slug;
      let form_title = slug_name.replace(/_/g, ' ');
      if (check_slug !== undefined) {
        slug_error = true;
        _cli.info('slug_name is already exist. try with another name!');
      }
      if (check_slug === undefined) {
        //if slug name given empty
        if (slug_name === '') {
          const result = await this.autoGeneratedSlug(table);
          slug_name = result[0];
          form_title = result[1];
        }
        const formColumns = await generateFormColumn(slug_name, form_title);
        const primaryKey = await this.primaryKeyOfTable(table);
        const foreignKeys = await this.foreignKeysGenerate(table);
        const checksField = await this.checkFieldGenerate(table);
        const formElements = await generateFormElement(
          table_schema,
          slug_name,
          table,
          primaryKey,
          foreignKeys,
          checksField,
        );
        await this.makeForm(formColumns, slug_name, form_title);
        await this.makeFormElement(formElements);
        slug_error = false;
      }
    } while (slug_error);
    // console.log(table);
    // console.log(table_schema);
    // const formElements = await generateFormElement(table, table_schema);
    // await this.makeFormAndElementTable(formColumns, formElements);
    // console.log(table_schema);
  }
  async tablescheam() {
    let error = true;
    let table_schema;
    let table;
    do {
      table = await _cli.ask('Enter table name:');
      if (table) {
        try {
          const table_schemas: any = await this.knex
            .select(
              'character_maximum_length',
              'is_nullable',
              'column_name',
              'udt_name',
              'numeric_precision',
              'numeric_scale',
            )
            .from('information_schema.columns')
            .where({ table_schema: 'public', table_name: table });
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          table_schema = table_schemas;
          if (table_schema.length > 0) {
            error = false;
          } else {
            _cli.info('Wrong table name. try again!');
          }
        } catch (error) {
          throw error;
        }
      }
    } while (error);
    return [table, table_schema];
  }
  async makeFormElement(formElements) {
    await this.knex('sys_form_elements')
      .insert(formElements)
      .catch((error) => this.knexErrorService.errorMessage(error.message));
  }
  async makeForm(payload, slug_name, form_title) {
    payload.form_slug = slug_name;
    payload.form_title = form_title;
    await this.knex('sys_forms')
      .insert(payload)
      .catch((error) => this.knexErrorService.errorMessage(error.message));
  }
  async checkSlug(form_slug) {
    const result = await this.knex('sys_forms')
      .select()
      .where({
        form_slug: form_slug,
      })
      .first()
      .catch((error) => this.knexErrorService.errorMessage(error.message));
    return result;
  }
  async autoGeneratedSlug(table) {
    const result = table.split(/_(.*)/)[1];
    const random = (Math.random() + 1).toString(36).substring(7);
    let form_slug = result + '_form_' + random;
    let form_title = form_slug.replace(/_/g, ' ');
    let check = true;
    do {
      const result = await this.knex('sys_forms')
        .select()
        .where({
          form_slug: form_slug,
        })
        .first()
        .catch((error) => this.knexErrorService.errorMessage(error.message));
      if (result === undefined) {
        check = false;
      } else {
        form_slug = result + '_form_' + random;
        form_title = form_slug.replace(/_/g, ' ');
      }
    } while (check);
    return [form_slug, form_title];
  }
  async primaryKeyOfTable(tableName) {
    const schema_data = await this.knex.raw(`SELECT C
    ."column_name" 
  FROM
    information_schema.table_constraints tc
    JOIN information_schema.constraint_column_usage AS ccu USING ( CONSTRAINT_SCHEMA, CONSTRAINT_NAME )
    JOIN information_schema.COLUMNS AS C ON C.table_schema = tc.CONSTRAINT_SCHEMA 
    AND tc.TABLE_NAME = C.TABLE_NAME 
    AND ccu.COLUMN_NAME = C.COLUMN_NAME 
  WHERE
    constraint_type = 'PRIMARY KEY' 
    AND tc.TABLE_NAME = '${tableName}'`);

    return schema_data.rows[0].column_name;
  }
  async foreignKeysGenerate(tableName) {
    const result = await this.knex.raw(`
    SELECT
      * 
    FROM
      information_schema.key_column_usage 
    WHERE
      CONSTRAINT_CATALOG = CURRENT_CATALOG 
      AND TABLE_NAME = '${tableName}' 
      AND position_in_unique_constraint NOTNULL;
    `);
    const foreignKeys = [];
    result.rows.map((item) => {
      if (item.column_name !== 'company_id') {
        foreignKeys.push(item.column_name);
      }
    });
    return foreignKeys;
  }
  async checkFieldGenerate(table) {
    const result = await this.knex.raw(`SELECT
    cc.check_clause 
  FROM
    information_schema.table_constraints tc
    JOIN information_schema.check_constraints cc ON tc.CONSTRAINT_SCHEMA = cc.CONSTRAINT_SCHEMA 
    AND tc.CONSTRAINT_NAME = cc.CONSTRAINT_NAME 
    
  WHERE
    tc.TABLE_NAME = '${table}'
    AND constraint_type = 'CHECK';`);
    return result.rows;
  }
}
