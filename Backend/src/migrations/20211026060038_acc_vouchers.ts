import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('acc_vouchers', (table) => {
    table.string('voucher_line_id', 50).primary().notNullable();
    table
      .integer('company_id', 11)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table
      .integer('branch_id', 11)
      .unsigned()
      .references('branch_id')
      .inTable('sys_branchs')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.string('voucher_no', 50).notNullable();
    table.date('voucher_date').notNullable();
    table.string('voucher_type', 50).notNullable();
    table.string('voucher_event', 250).notNullable();
    table.integer('sl_no', 11).notNullable();
    table
      .bigInteger('account_code')
      .references('account_code')
      .inTable('acc_chart_of_accounts')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.decimal('debit', 15, 8).defaultTo(0).notNullable();
    table.decimal('credit', 15, 8).defaultTo(0).notNullable();
    table.integer('voucher_status', 11).defaultTo(0).notNullable();
    table.text('narration').notNullable();
    table.text('remarks').nullable();
    table.integer('posted_by', 11).nullable();
    table.date('posted_at').nullable();
    table.string('posting_number', 50).nullable();
    table.json('voucher_tags').nullable();
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
  await knex.schema.hasTable('acc_vouchers').then(async function (exists) {
    if (exists) {
      await knex.schema.alterTable('acc_vouchers', (table) => {
        table.dropForeign('company_id');
        table.dropForeign('branch_id');
        table.dropForeign('account_code');
      });
      return knex.schema.dropTable('acc_vouchers');
    }
  });
}
