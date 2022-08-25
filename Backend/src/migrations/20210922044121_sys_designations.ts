import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('sys_designation', (table) => {
    table.increments('designation_id');
    table
      .integer('company_id', 10)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.string('designation_code', 20).unique().notNullable();
    table.string('designation_name', 50).notNullable();
    table.integer('created_by', 11).notNullable();
    table.integer('updated_by', 11).nullable();
    table.integer('deleted_by', 11).nullable();
    table.dateTime('created_at').notNullable();
    table.dateTime('updated_at').nullable();
    table.dateTime('deleted_at').nullable();

    table.specificType('status', 'smallint').defaultTo(1);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.hasTable('sys_designation').then(async function (exists) {
    if (exists) {
      await knex.schema.alterTable('sys_designation', (table) => {
        table.dropForeign('company_id');
      });
      return knex.schema.dropTable('sys_designation');
    }
  });
}
