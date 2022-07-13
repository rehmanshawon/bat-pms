import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('sys_privilege_items', (table) => {
    table.increments('privilege_item_id');
    table
      .integer('company_id', 10)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.integer('event_id', 10).notNullable();
    table.string('reference_value', 100).notNullable();
    table.text('sql_where_clause').nullable();
    table
      .string('event_slug_key', 100)
      .notNullable()
      .comment('the name of the field for which the value will check');
    table
      .text('permission')
      .notNullable()
      .comment('for which this permission has settings');
    table.text('no_permission').nullable();
    //default data
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
  await knex.schema
    .hasTable('sys_privilege_items')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable('sys_privilege_items', (table) => {
          table.dropForeign('company_id');
        });
        return knex.schema.dropTable('sys_privilege_items');
      }
    });
}
