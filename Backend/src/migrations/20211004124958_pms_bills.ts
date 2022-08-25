import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('pms_bills', (table) => {
    table.increments('bill_id');
    table.string('bill_code', 20).unique().notNullable();
    table.decimal('total_working_value', 15, 2).notNullable();
    table.specificType('is_product_or_service_received', 'smallint');
    table.decimal('invoice_amount', 15, 2).notNullable();
    table.string('invoice_number', 150);
    table.date('invoice_date').notNullable();
    table.date('receive_date').notNullable();
    table.string('reference_type', 20).notNullable();
    table.integer('reference_id', 11).notNullable();
    table.string('realize_reference_type', 20);
    table.integer('realize_reference_id', 11);
    table.string('realize_object_type', 20);
    table.integer('realize_object_id', 11);
    table.decimal('realize_amount', 15, 2);
    table
      .enu('vat_method', ['Inclusive', 'Exclusive', 'Not Applicable'])
      .notNullable();
    table
      .enu('tax_method', ['Inclusive', 'Exclusive', 'Not Applicable'])
      .notNullable();
    table
      .integer('payment_for_id', 11)
      .unsigned()
      .references('payment_for_id')
      .inTable('pms_payment_fors')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .index();
    table
      .integer('purchase_order_id', 11)
      .unsigned()
      .references('purchase_order_id')
      .inTable('sc_purchase_orders')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .index();
    table.string('po_code', 50).notNullable();
    table.decimal('po_total_value', 15, 2).notNullable();
    table.float('po_paid_up_to_date', 10, 2).notNullable();
    table.float('po_advance_paid', 10, 2).notNullable();
    table.float('po_pan_on_process', 10, 2).notNullable();
    table.string('payment_method', 20).notNullable();
    table.string('account_name', 50);
    table.string('account_number', 50);
    table.string('bank_name', 50);
    table.string('branch_name', 50);
    table.string('routing_number', 50);
    table
      .integer('currency_id', 11)
      .unsigned()
      .references('currency_id')
      .inTable('sys_currencys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .index();
    table.decimal('penalty_amount', 15, 2);
    table.float('penalty_percentage', 10, 2);
    table.decimal('commission_amount', 15, 2);
    table.float('commission_percentage', 10, 2);
    table.decimal('discount_amount', 15, 2);
    table.float('discount_percentage', 10, 2);
    table.decimal('security_deposit_amount', 15, 2);
    table.float('security_deposit_percentage', 10, 2);
    table.string('memo_type', 20);
    table.string('memo_number', 20);
    table.date('memo_date');
    table.string('challan_number', 50);
    table.date('challan_date');
    table.text('purpose').notNullable();
    table.text('remarks');
    table
      .integer('payment_approval_note_id', 11)
      .unsigned()
      .references('payment_approval_note_id')
      .inTable('pms_payment_approval_notes')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .index();
    table.integer('parent_bill_id', 11);
    table.string('bill_type', 50).notNullable();
    table.integer('bill_status', 11);
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
  await knex.schema.hasTable('pms_bills').then(async function (exists) {
    if (exists) {
      await knex.schema.alterTable('pms_bills', (table) => {
        table.dropForeign('payment_for_id');
        table.dropForeign('purchase_order_id');
        table.dropForeign('currency_id');
        table.dropForeign('payment_approval_note_id');
        //table.dropForeign('parent_bill_id');
        table.dropForeign('company_id');
      });
      return knex.schema.dropTable('pms_bills');
    }
  });
}
