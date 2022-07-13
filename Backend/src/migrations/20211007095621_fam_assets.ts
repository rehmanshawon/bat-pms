import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('fam_assets', (table) => {
    table.increments('asset_id').notNullable();
    table
      .integer('company_id', 10)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.integer('parent_asset_id', 11).nullable();
    table.string('asset_name', 100).unique().notNullable();
    table.string('asset_code', 20).unique().notNullable();
    table.string('po_code', 20).nullable();
    table.date('purchase_date').nullable();
    table.text('description').nullable();
    table
      .integer('asset_category_id', 10)
      .unsigned()
      .references('asset_category_id')
      .inTable('fam_asset_categorys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .index();
    table.date('registration_date').notNullable();
    table
      .integer('vendor_id', 10)
      .unsigned()
      .references('vendor_id')
      .inTable('config_vendors')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .index();
    table.decimal('total_price', 14, 2).nullable();
    table.decimal('current_book_value', 14, 2).nullable();
    table.date('received_date').nullable();
    table
      .integer('asset_type_id', 10)
      .unsigned()
      .references('product_id')
      .inTable('config_products')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .index()
      .notNullable();
    table.string('memo_number', 20).notNullable();
    table.date('memo_date').notNullable();
    table
      .specificType('is_depreciation', 'smallint')
      .defaultTo(0)
      .notNullable();
    table.specificType('is_warranty', 'smallint').defaultTo(0).notNullable();
    table.specificType('warranty_period', 'smallint').notNullable();
    table.date('warranty_from').nullable();
    table.date('warranty_to').nullable();
    table.text('warranty_remarks').nullable();
    table.date('last_maintenance_date').nullable();
    table.date('next_maintenance_date').nullable();
    table.specificType('asset_status', 'smallint').nullable();
    table.string('asset_image', 255).nullable();
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
  await knex.schema.hasTable('fam_assets').then(async function (exists) {
    if (exists) {
      await knex.schema.alterTable('fam_assets', (table) => {
        table.dropForeign('company_id');
        table.dropForeign('asset_category_id');
        table.dropForeign('vendor_id');
        table.dropForeign('asset_type_id');
      });
      return knex.schema.dropTable('fam_assets');
    }
  });
}
