import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('sys_privilege_events', (table) => {
    table.increments('event_id');
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
      .string('event_slug', 100)
      .notNullable()
      .comment(
        'A Name to identify the event. Must be meaningful. Could be duplicate. But all those duplicate for the same action. That means if multiple record found for any particular action all must be consider for access control.',
      );
    table
      .enum('event_ref', [
        'sys_dropdowns',
        'sys_master_grid',
        'sys_buttons',
        'url',
        'dashboard',
      ])
      .defaultTo('sys_dropdowns')
      .nullable()
      .comment('dropdown or grid');
    table
      .enum('event_key', [
        'Department',
        'Designation',
        'Division',
        'Branch',
        'Unit',
        'Section',
        'Level',
        'User',
      ])
      .notNullable()
      .comment(
        'user_level or department or something which is stored in Session.Could be logical input. such as : Department OR Designation Department And Designation',
      );
    table.text('text').nullable();
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
    .hasTable('sys_privilege_events')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable('sys_privilege_events', (table) => {
          table.dropForeign('company_id');
        });
        return knex.schema.dropTable('sys_privilege_events');
      }
    });
}
