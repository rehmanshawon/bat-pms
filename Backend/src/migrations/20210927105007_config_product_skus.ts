import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('config_product_skus', (table) => {
    table.increments('sku_id').notNullable();
    table
      .integer('company_id', 10)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.string('sku_name', 100).notNullable();
    table.string('sku_sort_name', 100);
    table
      .integer('product_id', 10)
      .unsigned()
      .references('product_id')
      .inTable('config_products')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .index()
      .notNullable();
    table.string('uom_code', 100);
    table.integer('qty_per_uom', 11);
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
  await knex.schema
    .hasTable('config_product_skus')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable('config_product_skus', (table) => {
          table.dropForeign('company_id');
          table.dropForeign('product_id');
        });
        return knex.schema.dropTable('config_product_skus');
      }
    });
}
