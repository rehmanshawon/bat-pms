import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('sc_purchase_requisitions', (table) => {
    table.increments('purchase_requisition_id').notNullable();
    table
      .integer('company_id', 10)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.string('purchase_requisition_code', 20).notNullable();
    table
      .integer('requisition_type_id', 11)
      .unsigned()
      .references('requisition_type_id')
      .inTable('sc_requisition_types')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .index();
    table.date('requisition_date').notNullable();
    table.date('expected_delivery_date').notNullable();
    table.text('purpose').nullable();
    table.text('remarks').nullable();
    table.integer('purchase_requisition_status', 11).notNullable().defaultTo(0);
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
    .hasTable('sc_purchase_requisitions')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable('sc_purchase_requisitions', (table) => {
          table.dropForeign('company_id');
          table.dropForeign('requisition_type_id');
        });
        return knex.schema.dropTable('sc_purchase_requisitions');
      }
    });
}
