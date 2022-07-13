import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('sys_divisions', (table) => {
    table.increments('division_id');
    table
      .integer('company_id', 10)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.string('division_code', 20).unique().notNullable();
    table.string('division_name', 50).notNullable();
    table.string('division_short_code', 5).nullable();
    table.string('division_logo', 255).nullable();
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
  await knex.schema.hasTable('sys_divisions').then(async function (exists) {
    if (exists) {
      await knex.schema.alterTable('sys_divisions', (table) => {
        table.dropForeign('company_id');
      });
      return knex.schema.dropTable('sys_divisions');
    }
  });
}
