import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('sys_currencys', (table) => {
    table.increments('currency_id').notNullable();
    table.string('currency_name', 20).notNullable();
    table.string('currency_short_name', 10).notNullable();

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
  await knex.schema.hasTable('sys_currencys').then(async function (exists) {
    if (exists) {
      return knex.schema.dropTable('sys_currencys');
    }
  });
}
