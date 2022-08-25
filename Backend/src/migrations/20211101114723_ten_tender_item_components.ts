import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('ten_tender_item_components', (table) => {
    table.increments('tender_item_component_id').notNullable();
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
      .integer('tender_item_id', 11)
      .unsigned()
      .references('tender_item_id')
      .inTable('ten_tender_items')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.string('component_name', 100).notNullable();
    table.text('component_details').nullable();
    table.decimal('request_qty', 15, 5).nullable();
    table.string('trans_uom', 10).notNullable();
    table.decimal('unit_price', 15, 2).nullable();

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
  await knex.schema
    .hasTable('ten_tender_item_components')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable('ten_tender_item_components', (table) => {
          table.dropForeign('company_id');
          table.dropForeign('tender_item_id');
        });
        return knex.schema.dropTable('ten_tender_item_components');
      }
    });
}
