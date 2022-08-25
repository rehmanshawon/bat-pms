import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('sc_requisition_items', (table) => {
    table.increments('requisition_item_id').notNullable();
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
      .integer('requisition_id', 11)
      .unsigned()
      .references('requisition_id')
      .inTable('sc_requisitions')
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
      .string('product_description', 255)
      .nullable()
      .comment('product name with code for example P-20210803005 (Laptop)');
    table
      .string('trans_uom', 10)
      .nullable()
      .comment('UoM code which user will view for this record');
    table.decimal('request_qty', 15, 5).nullable();
    table.decimal('received_qty', 15, 5).nullable();
    table.decimal('approved_qty', 15, 5).nullable();
    table.decimal('unit_price', 15, 5).nullable();
    table.decimal('total_price', 15, 5).nullable();
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
    .hasTable('sc_requisition_items')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable('sc_requisition_items', (table) => {
          table.dropForeign('company_id');
          table.dropForeign('requisition_id');
          table.dropForeign('product_id');
        });
        return knex.schema.dropTable('sc_requisition_items');
      }
    });
}
