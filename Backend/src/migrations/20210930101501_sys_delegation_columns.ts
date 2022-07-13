import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('sys_delegation_columns', (table) => {
    table.increments('delegation_columns_id').notNullable();
    table.string('table_name', 200).nullable();
    table.string('table_field', 200).nullable();
    table.string('table_field_value', 200).nullable();
    table.string('delegation_for', 200).nullable();
    table.string('delegation_ref_event_id', 200).nullable();
    table.string('delegation_version', 100).notNullable();
    table.integer('delegation_step', 10).nullable();
    table.integer('delegation_person', 10).nullable();
    table.integer('delegation_reliever_id', 10).nullable();
    table.integer('delegation_decline_count', 10).notNullable().defaultTo(0);
    table.date('delegation_final_approved').nullable();
    table.string('delegation_type', 20).nullable();
    table.date('delegation_initialized').nullable();
    table.text('delegation_manual_user');
    table.specificType('is_manual', 'smallint').nullable();
    table.integer('count_schedule', 10);
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
    .hasTable('sys_delegation_columns')
    .then(async function (exists) {
      if (exists) {
        return knex.schema.dropTable('sys_delegation_columns');
      }
    });
}
