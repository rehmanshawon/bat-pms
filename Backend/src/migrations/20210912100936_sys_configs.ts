import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('sys_configs', (table) => {
    table.increments('config_id');
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
    table.string('config_slug', 100).notNullable();
    table.string('config_key', 100).nullable();
    table.string('config_value', 100).notNullable();
    //default field
    table.integer('created_by', 10).notNullable();
    table.integer('updated_by', 10).nullable();
    table.integer('deleted_by', 10).nullable();
    table.dateTime('created_at').notNullable();
    table.dateTime('updated_at').nullable();
    table.dateTime('deleted_at').nullable();
    table.specificType('status', 'smallint').defaultTo(1);
    //create composite unique index
    // table.index(
    //   ['config_slug', 'company_id'],
    //   'sys_config_company_id_unique_index',
    //   'UNIQUE',
    // );
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.hasTable('sys_configs').then(async function (exists) {
    if (exists) {
      await knex.schema.alterTable('sys_configs', (table) => {
        // table.dropIndex(
        //   ['config_slug', 'company_id'],
        //   'sys_config_company_id_unique_index',
        // );
        table.dropForeign('module_id');
        table.dropForeign('company_id');
      });
      return knex.schema.dropTable('sys_configs');
    }
  });
}
