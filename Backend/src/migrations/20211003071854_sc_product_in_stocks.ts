import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('sc_product_in_stocks', (table) => {
    table.increments('product_in_stock_id').notNullable();
    table
      .integer('company_id', 10)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.integer('warehouse_id', 11).notNullable();
    table.integer('product_id', 11).notNullable();
    table.decimal('reorder_qty', 18, 5).nullable().defaultTo(0);
    table.decimal('stockin_qty', 18, 5).nullable().defaultTo(0);
    table.decimal('transfer_qty', 18, 5).nullable().defaultTo(0);
    table.decimal('sold_qty', 18, 5).nullable().defaultTo(0);
    table.decimal('used_qty', 18, 5).nullable().defaultTo(0);
    table.decimal('damaged_qty', 18, 5).nullable().defaultTo(0);
    //create composite unique index
    // table.index(
    //   ['warehouse_id', 'product_id'],
    //   'warehouse_id_product_id_unique_index',
    //   'UNIQUE',
    // );
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
    .hasTable('sc_product_in_stocks')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable('sc_product_in_stocks', (table) => {
          // table.dropIndex(
          //   ['warehouse_id', 'company_id'],
          //   'warehouse_id_product_id_unique_index',
          // );
          table.dropForeign('company_id');
        });
        return knex.schema.dropTable('sc_product_in_stocks');
      }
    });
}
