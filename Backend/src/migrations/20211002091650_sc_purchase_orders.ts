import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('sc_purchase_orders', (table) => {
    table.increments('purchase_order_id').notNullable();
    table
      .integer('company_id', 10)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.string('purchase_order_code', 20).nullable();
    table
      .integer('vendor_id', 11)
      .unsigned()
      .references('vendor_id')
      .inTable('config_vendors')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .index();
    table.enum('po_ref', ['CS', 'PI', 'PR']).notNullable();
    table.integer('po_ref_id', 11).notNullable();
    table.enum('po_type', ['Auto', 'Manual']).notNullable();
    table.decimal('po_value', 15, 2).notNullable();
    table.string('currency_code', 20).nullable();
    table.decimal('exchange_rate', 10, 2).nullable();
    table.decimal('po_value_bdt', 15, 2).notNullable();
    table.date('request_delivery_date').nullable();
    table.date('po_date').notNullable();
    table.date('offer_date').nullable();
    table.text('remarks').nullable();
    table.text('tnc').nullable();
    table.specificType('is_panalty_apply', 'smallint').nullable();
    table.decimal('panalty_percent', 5, 2).nullable();
    table.decimal('panalty_amount', 10, 2).nullable();
    table.text('panalty_tnc').nullable();
    table.specificType('is_security_apply', 'smallint').nullable();
    table.decimal('security_amount', 15, 2).nullable();
    table.decimal('security_percent', 5, 2).nullable();
    table.text('security_tnc').nullable();
    table
      .enum('vat_method', ['Inclusive', 'Exclusive', 'Not Applicable'])
      .nullable();
    table
      .enum('tax_method', ['Inclusive', 'Exclusive', 'Not Applicable'])
      .nullable();

    table.specificType('is_pg_apply', 'smallint').nullable();
    table.string('pg_number', 20).nullable();
    table.string('pg_issued', 100).nullable();
    table.decimal('pg_amount', 15, 2).nullable();
    table.string('pg_issued_bank_name', 255).nullable();
    table.string('pg_issued_bank_address', 255).nullable();
    table.date('pg_expiry_date').nullable();
    table.date('pg_extended_date').nullable();
    table.date('pg_release_date').nullable();
    table.text('shipping_address').nullable();
    table.text('billing_address').nullable();
    table.string('shipping_method', 100).nullable();
    table.text('shipping_advise').nullable();
    table.enum('purchase_type', ['Local', 'Foreign']).notNullable();
    table.specificType('purchase_order_status', 'smallint');
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
    .hasTable('sc_purchase_orders')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable('sc_purchase_orders', (table) => {
          table.dropForeign('company_id');
          table.dropForeign('vendor_id');
        });
        return knex.schema.dropTable('sc_purchase_orders');
      }
    });
}
