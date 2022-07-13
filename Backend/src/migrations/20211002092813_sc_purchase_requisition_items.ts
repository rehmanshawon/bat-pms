import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('sc_purchase_requisition_items', (table) => {
    table.increments('purchase_requisition_item_id').notNullable();
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
      .integer('purchase_requisition_id', 10)
      .unsigned()
      .references('purchase_requisition_id')
      .inTable('sc_purchase_requisitions')
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
    table
      .integer('tender_id', 11)
      .unsigned()
      .references('tender_id')
      .inTable('ten_tenders')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .nullable()
      .index();
    table.string('product_description', 255).nullable();
    table.string('trans_uom', 10).notNullable();
    table.decimal('request_qty', 15, 5).nullable();
    table.decimal('approved_qty', 15, 5).nullable();
    table.decimal('unit_price', 15, 2).nullable();
    table.string('currency_code', 10).nullable();
    table.decimal('exchange_rate', 10, 2).nullable();
    table.decimal('line_total', 15, 2).nullable();
    table.decimal('line_total_bdt', 15, 2).nullable();
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
    .hasTable('sc_purchase_requisition_items')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable(
          'sc_purchase_requisition_items',
          (table) => {
            table.dropForeign('company_id');
            table.dropForeign('purchase_requisition_id');
            table.dropForeign('product_id');
            table.dropForeign('tender_id');
          },
        );
        return knex.schema.dropTable('sc_purchase_requisition_items');
      }
    });
}
