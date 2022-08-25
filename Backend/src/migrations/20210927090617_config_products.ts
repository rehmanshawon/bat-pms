import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('config_products', (table) => {
    table.increments('product_id').notNullable();
    table
      .integer('company_id', 10)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.string('product_name', 100).notNullable();
    table.string('product_code', 20).unique().notNullable();
    table.string('cas_number', 20).nullable();
    table.string('hs_code', 20).nullable();
    table
      .integer('product_category_id', 11)
      .unsigned()
      .references('category_id')
      .inTable('config_product_categorys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.string('product_category', 255).nullable();
    table
      .integer('product_brand_id', 11)
      .unsigned()
      .references('brand_id')
      .inTable('config_product_brands')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .nullable()
      .index();
    table.string('product_types', 255).nullable();
    table.enum('operational_type', ['Goods', 'Services']).notNullable();
    table
      .enum('operational_group', ['CAPEX', 'OPEX'])
      .nullable()
      .defaultTo('OPEX');
    table.decimal('reorder_qty', 16, 2).nullable();
    table.decimal('minimum_order_qty', 16, 2).nullable();
    table
      .enum('stock_out_type', ['LIFO', 'FIFO', 'Custom'])
      .defaultTo('FIFO')
      .nullable();
    table.decimal('last_purchase_price', 16, 2).nullable();
    table.string('default_uom', 20).nullable();
    table.text('uoms_measurement').nullable();
    table.text('product_description').nullable();
    table.specificType('product_status', 'smallint');
    table
      .integer('vat_service_id', 11)
      .unsigned()
      .references('service_id')
      .inTable('vt_vat_services')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .nullable()
      .index();
    table.float('vat_ratio', 5, 2).nullable();
    table.string('vat_service_code', 20).nullable();
    table.string('tax_service_code', 20).nullable();

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
  await knex.schema.hasTable('config_products').then(async function (exists) {
    if (exists) {
      await knex.schema.alterTable('config_products', (table) => {
        table.dropForeign('company_id');
        table.dropForeign('product_brand_id');
        table.dropForeign('vat_service_id');
      });
      return knex.schema.dropTable('config_products');
    }
  });
}
