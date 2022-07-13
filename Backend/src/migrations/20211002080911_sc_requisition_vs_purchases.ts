import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('sc_requisition_vs_purchases', (table) => {
    table.increments('requisition_vs_purchase_id').notNullable();
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
      .integer('requisition_id', 11)
      .unsigned()
      .references('requisition_id')
      .inTable('sc_requisitions')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .index();
    table
      .integer('requisition_item_id', 11)
      .unsigned()
      .references('requisition_item_id')
      .inTable('sc_requisition_items')
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
    table.decimal('cart_qty', 18, 5).nullable();
    table.decimal('pr_requisition_qty', 18, 5).nullable();
    //table.decimal('cs_qty', 18, 5).nullable();
    table.decimal('po_qty', 18, 5).nullable();
    // table.decimal('pi_qty', 18, 5).nullable();
    table.decimal('receive_qty', 18, 5).nullable();
    table.decimal('challan_qty', 18, 5).nullable();
    table
      .integer('tender_method_id', 11)
      .unsigned()
      .references('tender_method_id')
      .inTable('ten_tender_methods')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .index();
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
    .hasTable('sc_requisition_vs_purchases')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable('sc_requisition_vs_purchases', (table) => {
          table.dropForeign('company_id');
          table.dropForeign('requisition_id');
          table.dropForeign('requisition_item_id');
          table.dropForeign('product_id');
        });
        return knex.schema.dropTable('sc_requisition_vs_purchases');
      }
    });
}
