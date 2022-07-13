import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('sys_delegation_matrix_logic', (table) => {
    table.increments('delegation_matrix_logic_id').notNullable();
    table
      .integer('company_id', 11)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.string('dlm_steps', 20).notNullable().comment('BM/HoD/CFO');
    table.integer('order_no', 11).notNullable();
    table.text('logic_sql').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema
    .hasTable('sys_delegation_matrix_logic')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable('sys_delegation_matrix_logic', (table) => {
          table.dropForeign('company_id');
        });
        return knex.schema.dropTable('sys_delegation_matrix_logic');
      }
    });
}
