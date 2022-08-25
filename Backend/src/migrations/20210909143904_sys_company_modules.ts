import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('sys_company_modules', (table) => {
    table
      .integer('module_id', 10)
      .unsigned()
      .references('module_id')
      .inTable('sys_modules')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .index();
    table
      .integer('company_id', 10)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema
    .hasTable('sys_company_modules')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable('sys_company_modules', (table) => {
          table.dropForeign('company_id');
          table.dropForeign('module_id');
        });
        return knex.schema.dropTable('sys_company_modules');
      }
    });
}
