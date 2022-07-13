import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('sys_audit_trail_historys', (table) => {
    table.increments('audit_trail_history_id').notNullable();
    table
      .integer('company_id', 11)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.string('table_name', 100).notNullable();
    table.string('primary_key_column', 100).notNullable();
    table.string('primary_key_id', 100).notNullable();
    table.string('master_table_id', 100).nullable();
    table.string('reference_type', 25).notNullable();
    table.text('reference_record', 'longtext').notNullable();
    table.datetime('log_time').notNullable();
    table.string('operation_ip', 255).notNullable();
    //default Coumn
    table.integer('created_by', 10).notNullable();
    table.dateTime('created_at').notNullable().defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema
    .hasTable('sys_audit_trail_historys')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable('sys_audit_trail_historys', (table) => {
          table.dropForeign('company_id');
        });
        return knex.schema.dropTable('sys_audit_trail_historys');
      }
    });
}
