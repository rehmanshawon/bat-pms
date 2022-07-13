import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('sc_product_receives', (table) => {
    table.increments('product_receive_id').notNullable();
    table
      .integer('company_id', 10)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.string('product_receive_code', 20).notNullable();
    table.date('receive_date').notNullable();
    table
      .enum('receive_ref', ['PO', 'PI', 'Transfer', 'Return', 'Manual'])
      .notNullable();
    table.integer('receive_ref_id', 11).nullable();
    table
      .integer('warehouse_id', 11)
      .unsigned()
      .references('warehouse_id')
      .inTable('config_warehouses')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .index()
      .notNullable();
    table
      .integer('vendor_id', 11)
      .unsigned()
      .references('vendor_id')
      .inTable('config_vendors')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .index()
      .nullable();
    table.string('vendor_challan_no', 20).nullable();
    table.date('vendor_challan_date');
    table.string('commercial_inv_no', 20).nullable();
    table.text('remarks');
    table
      .integer('product_id', 11)
      .unsigned()
      .references('product_id')
      .inTable('config_products')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .index()
      .notNullable();
    table.date('stock_in_date').nullable();
    table.decimal('receive_qty', 18, 5).notNullable();
    table.decimal('stock_out_qty', 18, 5).notNullable();
    table.string('trans_uom', 20).nullable();
    table.decimal('unit_purchase_price', 15, 2).nullable();
    table
      .enum('stock_out_status', ['Packed', 'Unpacked', 'Stock Out'])
      .notNullable();
    table.specificType('product_receive_status', 'smallint').defaultTo(1);
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
    .hasTable('sc_product_receives')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable('sc_product_receives', (table) => {
          table.dropForeign('company_id');
          table.dropForeign('warehouse_id');
          table.dropForeign('vendor_id');
          table.dropForeign('product_id');
        });
        return knex.schema.dropTable('sc_product_receives');
      }
    });
}
