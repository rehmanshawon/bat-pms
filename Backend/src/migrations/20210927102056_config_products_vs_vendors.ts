import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('config_products_vs_vendors', (table) => {
    table.increments('product_vs_vendor_id').notNullable();
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
      .integer('product_id', 10)
      .unsigned()
      .references('product_id')
      .inTable('config_products')
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
    .hasTable('config_products_vs_vendors')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable('config_products_vs_vendors', (table) => {
          table.dropForeign('company_id');
          table.dropForeign('product_id');
          table.dropForeign('vendor_id');
        });
        return knex.schema.dropTable('config_products_vs_vendors');
      }
    });
}
