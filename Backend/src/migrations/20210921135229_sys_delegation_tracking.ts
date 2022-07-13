import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('sys_delegation_tracking', (table) => {
    table.increments('delegation_tracking_id');
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
      .string('ref_id', 100)
      .notNullable()
      .comment('delegation job (purchase, sales, lc etc) id or code');
    table.string('delegation_for', 100).notNullable().comment('id slug');
    table
      .string('ref_event_id', 50)
      .nullable()
      .comment('delegation reference id from sys_delegation_conf');
    table
      .integer('delegation_version', 10)
      .nullable()
      .comment('delegation version from sys_delegation_conf');
    table
      .enum('act_status', ['Approved', 'Declined', 'Canceled', 'Processing'])
      .notNullable();
    table.timestamp('delegation_start');
    table.dateTime('delegation_end');
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
    .hasTable('sys_delegation_tracking')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable('sys_delegation_tracking', (table) => {
          table.dropForeign('company_id');
        });
        return knex.schema.dropTable('sys_delegation_tracking');
      }
    });
}
