import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('pms_payment_fors', (table) => {
    table.increments('payment_for_id');
    table.string('payment_for', 100).unique().notNullable();
    table
      .integer('company_id', 11)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();

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
  await knex.schema.hasTable('pms_payment_fors').then(async function (exists) {
    if (exists) {
      return knex.schema.dropTable('pms_payment_fors');
    }
  });
}
