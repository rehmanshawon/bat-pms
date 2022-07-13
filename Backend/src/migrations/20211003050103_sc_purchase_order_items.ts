import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('sc_purchase_order_items', (table) => {
    table.increments('po_item_id').notNullable();
    table
      .integer('company_id', 10)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table
      .integer('purchase_order_id', 11)
      .unsigned()
      .references('purchase_order_id')
      .inTable('sc_purchase_orders')
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
    table.decimal('po_qty', 18, 5).notNullable();
    table.decimal('approve_qty', 18, 5).nullable();
    table.string('trans_uom', 10).notNullable();
    table.decimal('po_unit_price', 15, 2).nullable();
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
    .hasTable('sc_purchase_order_items')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable('sc_purchase_order_items', (table) => {
          table.dropForeign('company_id');
          table.dropForeign('purchase_order_id');
          table.dropForeign('product_id');
        });
        return knex.schema.dropTable('sc_purchase_order_items');
      }
    });
}
