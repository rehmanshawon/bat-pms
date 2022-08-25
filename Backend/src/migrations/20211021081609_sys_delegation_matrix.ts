import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('sys_delegation_matrix', (table) => {
    table.increments('delegation_matrix_id').notNullable();
    table
      .integer('company_id', 11)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.string('ref_event_id', 255).nullable();
    table.string('delegation_slug', 20).notNullable().comment('req_code');
    table.string('dlm_steps', 20).notNullable().comment('BM/HoD/CFO');
    table.decimal('max_limit', 15, 2).notNullable();
    table.string('limit_type', 20).notNullable().comment('Maximum/Above');
    table.integer('order_no', 11).notNullable();
    table.string('delegation_version', 100).notNullable();
    //default Coumn
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
    .hasTable('sys_delegation_matrix')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable('sys_delegation_matrix', (table) => {
          table.dropForeign('company_id');
        });
        return knex.schema.dropTable('sys_delegation_matrix');
      }
    });
}
