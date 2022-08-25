import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('rms_terms_and_conditions', (table) => {
    table.increments('terms_and_condition_id');
    table
      .integer('company_id', 11)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
      .onDelete('RESTRICT');
    table.string('templates_title', 255).notNullable();
    table.string('templates_clauses', 255).notNullable();
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
    .hasTable('rms_terms_and_conditions')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable('rms_terms_and_conditions', (table) => {
          table.dropForeign('company_id');
        });
        return knex.schema.dropTable('rms_terms_and_conditions');
      }
    });
}
