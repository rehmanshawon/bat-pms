import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('sc_agreements', (table) => {
    table.increments('agreement_id').notNullable();
    table
      .integer('company_id', 10)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table
      .integer('vendor_id', 11)
      .unsigned()
      .references('vendor_id')
      .inTable('config_vendors')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .index();
    table.date('agreement_start').nullable();
    table.date('agreement_expiry').nullable();
    table.text('remarks').nullable();
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
  await knex.schema.hasTable('sc_agreements').then(async function (exists) {
    if (exists) {
      await knex.schema.alterTable('sc_agreements', (table) => {
        table.dropForeign('company_id');
        table.dropForeign('vendor_id');
      });
      return knex.schema.dropTable('sc_agreements');
    }
  });
}
