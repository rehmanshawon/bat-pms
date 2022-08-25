export function createMigraionFile(migrationDataArray, path) {
  createMigration(migrationDataArray, path);
}

async function createMigration(migrationDataArray, path) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const fs = require('fs');
  for (let index = 0; index < 1; index++) {
    const { table_name, basicSchema, primaryKey, foreignKeys } =
      migrationDataArray[index];
    const file_name = index + '_' + table_name;
    const content = makeContent(
      table_name,
      basicSchema,
      primaryKey,
      foreignKeys,
    );
    fs.writeFileSync(`${path}/${file_name}.ts`, content);
  }
  return true;
}

function makeContent(table_name, basicSchema, primaryKey, foreignKeys) {
  const dynamicSchema = makeSchema(basicSchema, foreignKeys);
  const content = `import { Knex } from 'knex';

  export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('${table_name}', (table) => {
      ${primaryKey ? `table.increments('${primaryKey}');` : ''}
      ${dynamicSchema}
      table.integer('created_by', 10).notNullable();
      table.integer('updated_by', 10).nullable();
      table.integer('deleted_by', 10).nullable();
      table.dateTime('created_at').notNullable();
      table.dateTime('updated_at').nullable();
      table.dateTime('deleted_at').nullable();
      table.specificType('status', 'smallint').defaultTo(1);
    });
  }
  
  export async function down(knex: Knex): Promise<void> {
    await knex.schema.hasTable('${table_name}').then(async function (exists) {
      if (exists) {
        return knex.schema.dropTable('${table_name}');
      }
    });
  }
  `;
  return content;
}
function makeSchema(basicSchema, foreignKeys) {
  console.log(foreignKeys);
  // table.string('company_code', 20).unique().notNullable();
  // table.string('company_name', 50).notNullable();
  // table.string('company_short_code', 5).nullable();
  // table.string('company_logo', 255).nullable();
  // table.string('company_address', 100).nullable();
  // table.text('company_contact').nullable();
  // table.string('company_mobile', 20).notNullable();
  const finalSchema = basicSchema.filter(
    (item) =>
      item.column_name !== 'created_by' &&
      item.column_name !== 'updated_by' &&
      item.column_name !== 'deleted_by' &&
      item.column_name !== 'created_at' &&
      item.column_name !== 'updated_at' &&
      item.column_name !== 'deleted_at' &&
      item.column_name !== 'status',
  );
  let schema = ``;
  finalSchema.map((item) => {
    const localschema = `table.${typecheck(item.udt_name)}('${
      item.column_name
    }', ${item.character_maximum_length}).${
      item.is_nullable === 'YES' ? `nullable()` : `notNullable()`
    };\n`;
    schema += localschema;
  });
  return schema;
}
function typecheck(type) {
  // hash table for type check
  const typetable = {
    varchar: 'string',
    text: 'text',
    tinyint: 'integer',
    smallint: 'integer',
    int4: 'integer',
    int2: 'integer',
    float4: 'integer',
    numeric: 'decimal',
    timestamptz: 'Date',
    datetime: 'Date',
    date: 'Date',
    timestamp: 'Date',
    enum: 'string',
  };
  return typetable[type];
}
