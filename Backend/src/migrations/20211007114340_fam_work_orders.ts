import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('fam_work_orders', (table) => {
    table.increments('work_order_id').notNullable();
    table
      .integer('company_id', 11)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.string('work_order_code', 20).notNullable();
    table
      .integer('vendor_id', 10)
      .unsigned()
      .references('vendor_id')
      .inTable('config_vendors')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .index();
    table.date('work_order_date').nullable();
    table.text('remarks').nullable();
    table.text('terms_conditions').nullable();
    table.integer('work_order_status').nullable();
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
  await knex.schema.hasTable('fam_work_orders').then(async function (exists) {
    if (exists) {
      await knex.schema.alterTable('fam_work_orders', (table) => {
        table.dropForeign('company_id');
        table.dropForeign('vendor_id');
      });
      return knex.schema.dropTable('fam_work_orders');
    }
  });
}
