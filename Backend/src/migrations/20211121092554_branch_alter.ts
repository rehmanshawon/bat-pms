import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('sys_branchs', (table) => {
    table
      .integer('dispatch_manager_id', 11)
      .unsigned()
      .references('employee_id')
      .inTable('config_employees')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.hasTable('sys_branchs').then(async function (exists) {
    if (exists) {
      await knex.schema.alterTable('sys_branchs', (table) => {
        table.dropForeign('dispatch_manager_id');
      });
    }
  });
}
