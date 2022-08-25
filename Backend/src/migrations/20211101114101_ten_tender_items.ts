import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('ten_tender_items', (table) => {
    table.increments('tender_item_id').notNullable();
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
      .integer('tender_id', 11)
      .unsigned()
      .references('tender_id')
      .inTable('ten_tenders')
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
    table.decimal('product_qty', 15, 5).nullable();
    table.string('trans_uom', 10).notNullable();
    table.decimal('product_price', 10, 2).nullable();
    table.text('product_description').nullable();

    //default data
    table.integer('created_by', 10).notNullable();
    table.integer('updated_by', 10).nullable();
    table.integer('deleted_by', 10).nullable();
    table.dateTime('created_at').defaultTo(knex.fn.now()).notNullable();
    table.dateTime('updated_at').nullable();
    table.dateTime('deleted_at').nullable();
    table.specificType('status', 'smallint').defaultTo(1);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.hasTable('ten_tender_items').then(async function (exists) {
    if (exists) {
      await knex.schema.alterTable('ten_tender_items', (table) => {
        table.dropForeign('company_id');
        table.dropForeign('tender_id');
        table.dropForeign('product_id');
      });
      return knex.schema.dropTable('ten_tender_items');
    }
  });
}
