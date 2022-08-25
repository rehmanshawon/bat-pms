import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('sc_reconciliation_items', (table) => {
    table.increments('reconciliation_item_id').notNullable();
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
      .integer('reconciliation_id', 11)
      .unsigned()
      .references('reconciliation_id')
      .inTable('sc_reconciliations')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table
      .integer('product_id', 11)
      .unsigned()
      .references('product_id')
      .inTable('config_products')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .index();
    table.decimal('current_stock_qty', 18, 5).notNullable();
    table.decimal('actual_stock_qty', 18, 5).notNullable();
    table.decimal('used_qty', 18, 5).notNullable();
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
    .hasTable('sc_reconciliation_items')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable('sc_reconciliation_items', (table) => {
          table.dropForeign('company_id');
          table.dropForeign('reconciliation_id');
          table.dropForeign('product_id');
        });
        return knex.schema.dropTable('sc_reconciliation_items');
      }
    });
}
