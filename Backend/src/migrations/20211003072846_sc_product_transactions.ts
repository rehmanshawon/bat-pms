import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('sc_product_transactions', (table) => {
    table.bigIncrements('product_in_stock_id').notNullable();
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
      .integer('product_receive_id', 11)
      .unsigned()
      .references('product_receive_id')
      .inTable('sc_product_receives')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .index();
    table
      .enum('trans_ref', [
        'purchase',
        'Sales',
        'Transfer',
        'Office use',
        'Production',
      ])
      .notNullable();
    table.integer('trans_ref_id', 11).notNullable();
    table.date('trans_date').notNullable();
    table.decimal('unit_purchase_price', 15, 2).nullable();
    table
      .integer('warehouse_id', 11)
      .unsigned()
      .references('warehouse_id')
      .inTable('config_warehouses')
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
    table.decimal('stockin_qty', 18, 5).nullable();
    table.decimal('transfer_qty', 18, 5).nullable();
    table.decimal('sold_qty', 18, 5).nullable();
    table.decimal('used_qty', 18, 5).nullable();
    table.decimal('damaged_qty', 18, 5).nullable();
    table.decimal('production_qty', 18, 5).nullable();
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
    .hasTable('sc_product_transactions')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable('sc_product_transactions', (table) => {
          table.dropForeign('company_id');
          table.dropForeign('product_receive_id');
          table.dropForeign('warehouse_id');
          table.dropForeign('product_id');
        });
        return knex.schema.dropTable('sc_product_transactions');
      }
    });
}
