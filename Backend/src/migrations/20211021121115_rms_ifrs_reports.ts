import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('rms_ifrs_reports', (table) => {
    table.increments('ifrs_report_id');
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
      .integer('premises_id')
      .unsigned()
      .references('premises_id')
      .inTable('rms_premisess')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table
      .integer('agreement_id', 11)
      .unsigned()
      .references('agreement_id')
      .inTable('rms_agreements')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.string('month', 7).notNullable();
    table.decimal('payment_amount', 18, 6).notNullable();
    table.decimal('discount_factor', 18, 6).notNullable();
    table.decimal('present_value', 18, 6).notNullable();
    table.decimal('lease_opening_balance', 18, 6).notNullable();
    table.decimal('lease_payment', 18, 6).notNullable();
    table.decimal('lease_interest_expense_rate', 18, 6).notNullable();
    table.decimal('lease_interest_expense', 18, 6).notNullable();
    table.decimal('lease_settlement', 18, 6).notNullable();
    table.decimal('lease_closing_balance', 18, 6).notNullable();
    table.decimal('right_opening_balance', 18, 6).notNullable();
    table.decimal('right_depreciation', 18, 6).notNullable();
    table.decimal('right_closing_balance', 18, 6).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.hasTable('rms_ifrs_reports').then(async function (exists) {
    if (exists) {
      await knex.schema.alterTable('rms_ifrs_reports', (table) => {
        table.dropForeign('company_id');
        table.dropForeign('premises_id');
        table.dropForeign('agreement_id');
      });
      return knex.schema.dropTable('rms_ifrs_reports');
    }
  });
}
