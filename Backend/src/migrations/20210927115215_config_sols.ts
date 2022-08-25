import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('config_sols', (table) => {
    table.increments('sol_id').notNullable();
    table
      .integer('company_id', 10)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.string('sol_name', 100).notNullable();
    table.string('sol_code', 20).nullable();
    table.string('address', 255).nullable();
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
  await knex.schema.hasTable('config_sols').then(async function (exists) {
    if (exists) {
      await knex.schema.alterTable('config_sols', (table) => {
        table.dropForeign('company_id');
      });
      return knex.schema.dropTable('config_sols');
    }
  });
}
