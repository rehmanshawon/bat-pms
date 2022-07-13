import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('rms_owners_invoices', (table) => {
    table.increments('owners_invoice_id');
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
      .integer('payment_schedule_id', 11)
      .unsigned()
      .references('payment_schedule_id')
      .inTable('rms_payment_schedules')
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
    table.integer('collector_id', 11).notNullable();
    table.string('month', 7).notNullable();
    table.decimal('monthly_rent', 18, 6).notNullable();
    table.decimal('fixed_amount', 18, 6).notNullable();
    table.decimal('variable_amount', 18, 6).notNullable();
    table.decimal('arrear_amount', 18, 6).notNullable();
    table.decimal('special_addition', 18, 6).notNullable();
    table.decimal('special_deduction', 18, 6).notNullable();
    table.decimal('payable_amount', 18, 6).notNullable();
    table.decimal('paid_amount', 18, 6).notNullable();
    table.decimal('due_amount', 18, 6).notNullable();
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
  await knex.schema
    .hasTable('rms_owners_invoices')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable('rms_owners_invoices', (table) => {
          table.dropForeign('company_id');
          table.dropForeign('payment_schedule_id');
          table.dropForeign('premises_id');
          table.dropForeign('agreement_id');
        });
        return knex.schema.dropTable('rms_owners_invoices');
      }
    });
}
