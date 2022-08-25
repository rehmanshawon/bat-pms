import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('sc_req_type_vs_products', (table) => {
    table.increments('req_type_vs_product_id').notNullable();
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
      .integer('requisition_type_id', 11)
      .unsigned()
      .references('requisition_type_id')
      .inTable('sc_requisition_types')
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
    table.string('requisition_type_name', 100).notNullable();
    table.text('requisition_type_remarks').nullable();
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
    .hasTable('sc_req_type_vs_products')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable('sc_req_type_vs_products', (table) => {
          table.dropForeign('company_id');
          table.dropForeign('requisition_type_id');
          table.dropForeign('product_id');
        });
        return knex.schema.dropTable('sc_req_type_vs_products');
      }
    });
}
