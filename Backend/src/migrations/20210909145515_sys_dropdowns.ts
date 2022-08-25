import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('sys_dropdowns', (table) => {
    table.increments('dropdown_id');
    table.string('dropdown_name', 50).notNullable();
    table.integer('module_id', 10).nullable();
    table
      .integer('company_id', 10)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.string('dropdown_slug', 50).unique().notNullable();
    table
      .enum('dropdown_mode', ['dropdown', 'autocomplete_suggest'])
      .notNullable()
      .defaultTo('dropdown');
    table.text('sql_select').notNullable();
    table.text('sql_source').notNullable();
    table.text('sql_condition').nullable();
    table.text('sql_group_by').nullable();
    table.text('sql_having').nullable();
    table.text('sql_order_by').nullable();
    table.text('sql_limit').nullable();
    table.string('value_field', 50).notNullable();
    table.string('option_field', 50).notNullable();
    table.text('search_columns').nullable();
    table.text('description').nullable();
    table.integer('created_by', 10).notNullable();
    table.integer('updated_by', 10).nullable();
    table.integer('deleted_by', 10).nullable();
    table.dateTime('created_at').notNullable();
    table.dateTime('updated_at').nullable();
    table.dateTime('deleted_at').nullable();
    table.specificType('status', 'smallint').defaultTo(1);
    //create composite unique index
    // table.index(
    //   ['dropdown_slug', 'company_id'],
    //   'sys_dropdowns_company_id_unique_index',
    //   'UNIQUE',
    // );
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.hasTable('sys_dropdowns').then(async function (exists) {
    if (exists) {
      await knex.schema.alterTable('sys_dropdowns', (table) => {
        // table.dropIndex(
        //   ['dropdown_slug', 'company_id'],
        //   'sys_dropdowns_company_id_unique_index',
        // );
        table.dropForeign('company_id');
      });
      return knex.schema.dropTable('sys_dropdowns');
    }
  });
}
