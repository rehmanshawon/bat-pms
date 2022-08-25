import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('fam_challans', (table) => {
    table.increments('challan_id').notNullable();
    table
      .integer('company_id', 11)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.string('challan_code', 20).notNullable();
    table
      .integer('work_order_id', 11)
      .unsigned()
      .references('work_order_id')
      .inTable('fam_work_orders')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .index();
    table
      .integer('vendor_id', 10)
      .unsigned()
      .references('vendor_id')
      .inTable('config_vendors')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .index();
    table.text('remarks').nullable();
    table.date('challan_date').nullable();
    table.string('challan_method', 150).nullable();
    table.string('courier_tracking_no', 100).nullable();
    table
      .integer('courier_service_id', 10)
      .unsigned()
      .references('courier_service_id')
      .inTable('config_courier_services')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .index();
    table.string('gate_pass_code', 20).nullable();
    table.integer('challan_status', 11).nullable();
    table.string('received_by', 100).nullable();
    table.date('received_date').nullable();
    table.integer('branch_id', 11).nullable();
    table.integer('department_id', 11).nullable();
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
  await knex.schema.hasTable('fam_challans').then(async function (exists) {
    if (exists) {
      await knex.schema.alterTable('fam_challans', (table) => {
        table.dropForeign('company_id');
        table.dropForeign('work_order_id');
        table.dropForeign('vendor_id');
        table.dropForeign('courier_service_id');
      });
      return knex.schema.dropTable('fam_challans');
    }
  });
}
