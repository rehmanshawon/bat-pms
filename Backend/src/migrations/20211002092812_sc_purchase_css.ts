import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('sc_purchase_css', (table) => {
    table.increments('purchase_cs_id').notNullable();
    table
      .integer('company_id', 10)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.string('purchase_cs_code', 20).nullable();
    table
      .integer('tender_id', 10)
      .unsigned()
      .references('tender_id')
      .inTable('ten_tenders')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .index();
    table
      .integer('vendor_id', 10)
      .unsigned()
      .references('vendor_id')
      .inTable('config_vendors')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .index();
    table
      .integer('product_id', 11)
      .unsigned()
      .references('product_id')
      .inTable('config_products')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .index();
    table.decimal('request_qty', 18, 5).nullable();
    table.decimal('capable_qty', 18, 5).nullable();
    table.decimal('cs_approve_qty', 18, 5).nullable();
    table.string('trans_uom', 20).nullable();
    table.decimal('propose_unit_price', 15, 2).nullable();
    table.string('currency_code', 20).nullable();
    table.decimal('exchange_rate', 10, 2).nullable();
    table.decimal('propose_unit_price_bdt', 15, 2).nullable();
    table.string('price_type', 50).nullable();
    table.specificType('is_selected', 'smallint').nullable();
    table.text('vendor_specification').nullable();
    table.text('remarks').nullable();
    table
      .integer('purchase_order_id', 11)
      .unsigned()
      .references('purchase_order_id')
      .inTable('sc_purchase_orders')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .index();
    table.integer('purchase_cs_status', 10).notNullable().defaultTo(0);
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
  await knex.schema.hasTable('sc_purchase_css').then(async function (exists) {
    if (exists) {
      await knex.schema.alterTable('sc_purchase_css', (table) => {
        table.dropForeign('company_id');
        table.dropForeign('tender_id');
        table.dropForeign('vendor_id');
        table.dropForeign('product_id');
        table.dropForeign('purchase_order_id');
      });
      return knex.schema.dropTable('sc_purchase_css');
    }
  });
}
