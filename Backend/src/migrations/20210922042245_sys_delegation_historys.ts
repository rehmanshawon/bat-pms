import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('sys_delegation_historys', (table) => {
    table.string('ref_event', 50);
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
      .comment(
        'The unique code of the reference. could be purchase order id or purchase order code',
      );
    table.integer('step_no', 2).nullable();
    table
      .enum('act_status', ['Approved', 'Declined', 'Canceled'])
      .notNullable();
    table
      .integer('delegation_person', 10)
      .notNullable()
      .comment('the person id who either Approved or Declined');
    table
      .integer('delegation_reliever_id', 10)
      .notNullable()
      .comment('if no releiver same user id stored');
    table.text('act_comments').nullable();
    table
      .text('additional_data')
      .nullable()
      .comment('Extra input value by auth person');
    table.integer('delegation_decline_count', 10).nullable();
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
    .hasTable('sys_delegation_historys')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable('sys_delegation_historys', (table) => {
          table.dropForeign('company_id');
        });
        return knex.schema.dropTable('sys_delegation_historys');
      }
    });
}
