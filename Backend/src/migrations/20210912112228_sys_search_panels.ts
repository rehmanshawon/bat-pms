import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('sys_search_panels', (table) => {
    table.increments('search_panel_id');
    table.string('search_panel_slug', 50).unique().notNullable();
    table.string('search_panel_title', 100).nullable();
    table
      .integer('company_id', 10)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.string('default_search_by', 200).notNullable();
    table.text('description').notNullable();
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
    //   ['search_panel_slug', 'company_id'],
    //   'sys_search_panel_slug_company_id_unique_index',
    //   'UNIQUE',
    // );
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.hasTable('sys_search_panels').then(async function (exists) {
    if (exists) {
      await knex.schema.alterTable('sys_search_panels', (table) => {
        // table.dropIndex(
        //   ['search_panel_slug', 'company_id'],
        //   'sys_search_panel_slug_company_id_unique_index',
        // );
        table.dropForeign('company_id');
      });
      return knex.schema.dropTable('sys_search_panels');
    }
  });
}
