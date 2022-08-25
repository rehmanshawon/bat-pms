import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('rms_payment_schedule_details', (table) => {
    table.increments('payment_schedule_detail_id');
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
    table
      .integer('cost_component_id', 11)
      .unsigned()
      .references('cost_component_id')
      .inTable('rms_cost_components')
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
      .integer('owners_invoice_id', 11)
      .unsigned()
      .references('owners_invoice_id')
      .inTable('rms_owners_invoices')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.integer('collector_id', 11).notNullable();
    table.string('payment_month', 7).notNullable();
    table.decimal('component_amount', 18, 6).notNullable();
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
    .hasTable('rms_payment_schedule_details')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable(
          'rms_payment_schedule_details',
          (table) => {
            table.dropForeign('company_id');
            table.dropForeign('premises_id');
            table.dropForeign('agreement_id');
            table.dropForeign('cost_component_id');
            table.dropForeign('payment_schedule_id');
            table.dropForeign('owners_invoice_id');
          },
        );
        return knex.schema.dropTable('rms_payment_schedule_details');
      }
    });
}
