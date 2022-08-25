import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('sc_product_items', (table) => {
    table.increments('item_id').notNullable();
    table
      .integer('company_id', 11)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
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
      .notNullable()
      .index();
    table
      .integer('warehouse_id', 11)
      .unsigned()
      .references('warehouse_id')
      .inTable('config_warehouses')
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
      .notNullable()
      .index();
    table.string('item_name', 100).notNullable();
    table.string('item_code', 20).notNullable();
    table.text('item_description').nullable();
    table
      .enum('item_identity_type', ['Serial', 'MAC', 'IME'])
      .defaultTo('Serial')
      .notNullable();
    table.string('item_identity_number', 100).nullable();
    table.date('warrenty_start_date').nullable();
    table.date('warrenty_expiry_date').nullable();
    table.enum('assign_ref', ['warehouse', 'challan']).nullable();
    table.integer('assign_ref_id', 11).nullable();
    table
      .enum('allocation_type', ['sold', 'used', 'damaged', 'returned'])
      .nullable();
    table
      .integer('fam_asset_id', 11)
      .unsigned()
      .references('asset_id')
      .inTable('fam_assets')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.specificType('is_fixed_asset', 'smallint').defaultTo(0);
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
  await knex.schema.hasTable('sc_product_items').then(async function (exists) {
    if (exists) {
      await knex.schema.alterTable('sc_product_items', (table) => {
        table.dropForeign('company_id');
        table.dropForeign('maint_request_id');
        table.dropForeign('asset_id');
        table.dropForeign('employee_id');
        table.dropForeign('vendor_id');
      });
      return knex.schema.dropTable('sc_product_items');
    }
  });
}
