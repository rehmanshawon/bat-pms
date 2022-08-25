import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('sys_companys', (table) => {
    table.increments('company_id');
    table.string('company_code', 20).unique().notNullable();
    table.string('company_name', 50).notNullable();
    table.string('company_short_code', 5).nullable();
    table.string('company_logo', 255).nullable();
    table.string('company_address', 100).nullable();
    table.text('company_contact').nullable();
    table.string('company_mobile', 20).notNullable();
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
  await knex.schema.hasTable('sys_companys').then(async function (exists) {
    if (exists) {
      return knex.schema.dropTable('sys_companys');
    }
  });
}
