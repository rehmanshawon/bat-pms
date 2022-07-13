import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('pms_payment_approval_notes', (table) => {
    table.increments('payment_approval_note_id').notNullable();
    table.string('payment_approval_note_code', 20).notNullable();
    table.date('payment_approval_note_date').notNullable();
    table.string('reference_type', 20).notNullable();
    table.integer('reference_id', 11).notNullable();
    table.string('reference_name', 150).notNullable();
    table.decimal('total_po_amount', 15, 2).notNullable();
    table.float('total_paid_up_to_date', 10, 2).notNullable();
    table.float('total_pan_on_process', 10, 2).notNullable();
    table.decimal('total_invoice_amount', 15, 2).notNullable();
    table.decimal('approve_amount', 15, 2).notNullable();
    table.decimal('total_penalty_amount', 15, 2).notNullable();
    table.text('purpose');
    table.text('remarks');
    table.integer('payment_approval_note_status', 11).notNullable();
    table
      .integer('currency_id', 11)
      .unsigned()
      .references('currency_id')
      .inTable('sys_currencys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.string('payment_approval_note_type', 20).notNullable();
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
  return knex.schema
    .hasTable('pms_payment_approval_notes')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable('pms_payment_approval_notes', (table) => {
          table.dropForeign('currency_id');
          table.dropForeign('company_id');
        });
        return knex.schema.dropTable('pms_payment_approval_notes');
      }
    });
}
