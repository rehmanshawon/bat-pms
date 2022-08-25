import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('sys_privilege_item_users', (table) => {
    table
      .integer('reference_userid')
      .comment('Must be a single valid userid from sys_users table')
      .nullable();
    table
      .integer('company_id', 10)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table
      .enum('event_ref', ['sys_dropdowns', 'sys_master_grid'])
      .defaultTo('sys_dropdowns')
      .nullable()
      .comment('dropdown or grid');
    table.string('event_slug', 100).unique().notNullable();
    table
      .string('event_slug_key', 100)
      .unique()
      .notNullable()
      .comment('the name of the field for which the value will check');
    table
      .text('permission')
      .notNullable()
      .comment(
        'All = No Need to specify, forcely all privilege, NoAccess = Forcely No Access, Comma Separated ID for specific Access.',
      );
    table.text('no_permission').nullable();
    table.text('sql_where_clause').nullable();
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
    .hasTable('sys_privilege_item_users')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable('sys_privilege_item_users', (table) => {
          table.dropForeign('company_id');
        });
        return knex.schema.dropTable('sys_privilege_item_users');
      }
    });
}
