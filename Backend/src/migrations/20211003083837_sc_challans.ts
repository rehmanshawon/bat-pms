import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('sc_challans', (table) => {
    table.increments('challan_id').notNullable();
    table
      .integer('company_id', 10)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.string('challan_code', 20).notNullable();
    table.date('challan_date').notNullable();
    table.integer('challan_warehouse_id', 11).notNullable();
    table
      .integer('requisition_id', 11)
      .unsigned()
      .references('requisition_id')
      .inTable('sc_requisitions')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .index();
    table
      .integer('branch_id', 10)
      .unsigned()
      .references('branch_id')
      .inTable('sys_branchs')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.text('delivery_address').nullable();
    table.string('goods_receive_person', 100).nullable();
    table.text('remarks').nullable();
    table
      .integer('product_id', 10)
      .unsigned()
      .references('product_id')
      .inTable('config_products')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .index();
    table.decimal('challan_qty', 18, 5).notNullable();
    table.text('item_remarks').nullable();
    //default Coumn
    table.integer('created_by', 10).notNullable();
    table.integer('updated_by', 10).nullable();
    table.integer('deleted_by', 10).nullable();
    table.dateTime('created_at').notNullable();
    table.dateTime('updated_at').nullable();
    table.dateTime('deleted_at').nullable();
    table.specificType('status', 'smallint').defaultTo(1);

    //getpass columns
    table.text('gatepass_remark').nullable();
    table.integer('gatepass_created_by', 32).nullable();
    table.dateTime('gatepass_created_at').nullable();

    //product receive column
    table.integer('stockin_warehouse_id', 16).nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.hasTable('sc_challans').then(async function (exists) {
    if (exists) {
      await knex.schema.alterTable('sc_challans', (table) => {
        table.dropForeign('company_id');
        table.dropForeign('requisition_id');
        table.dropForeign('branch_id');
      });
      return knex.schema.dropTable('sc_challans');
    }
  });
}
