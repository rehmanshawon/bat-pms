import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('acc_autovouchers', (table) => {
    table.increments('autovoucher_id').notNullable();
    table
      .integer('company_id', 10)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.string('product', 150).notNullable();
    table.string('event', 250).notNullable();
    table.string('account_code', 150).notNullable();
    table.string('payment_caption', 50).nullable();
    table.text('payment_caption_query').nullable();
    table.string('dr_cr', 50).notNullable();
    table.integer('primary_tag_id', 11).notNullable();
    table.specificType('version', 'smallint').nullable();
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
  await knex.schema.hasTable('acc_autovouchers').then(async function (exists) {
    if (exists) {
      await knex.schema.alterTable('acc_autovouchers', (table) => {
        table.dropForeign('company_id');
      });
      return knex.schema.dropTable('acc_autovouchers');
    }
  });
}
