import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('sys_menus', (table) => {
    table.increments('menu_id');
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
    table.string('menu_name', 100).unique().notNullable();
    table.string('menu_description', 100).nullable();
    table.string('menu_icon_class', 100).notNullable();
    table.string('menu_url', 100).notNullable().comment('after base url');
    table.integer('parent_menu_id', 10).defaultTo(0).notNullable();
    table.integer('sort_number', 10).defaultTo(0).notNullable();
    //default column
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
  await knex.schema.hasTable('sys_menus').then(async function (exists) {
    if (exists) {
      await knex.schema.alterTable('sys_menus', (table) => {
        table.dropForeign('module_id');
        table.dropForeign('company_id');
      });
      return knex.schema.dropTable('sys_menus');
    }
  });
}
