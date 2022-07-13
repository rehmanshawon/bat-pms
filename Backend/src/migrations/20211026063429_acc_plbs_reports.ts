import { Knex } from 'knex';
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('acc_plbs_reports', (table) => {
    table.bigIncrements('plbs_report_id').notNullable();
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
      .integer('branch_id', 11)
      .unsigned()
      .references('branch_id')
      .inTable('sys_branchs')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.string('plbs_report_period', 20).notNullable();
    table.date('from_date').notNullable();
    table.date('to_date').notNullable();
    table
      .bigInteger('plbs_code')
      .unsigned()
      .references('plbs_code')
      .inTable('acc_plbs_items')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.decimal('debit', 18, 2).nullable();
    table.decimal('credit', 18, 2).nullable();
    table.integer('warehouse_id', 11).nullable();
    table.integer('project_id', 11).nullable();
    table.integer('vendor_id', 11).nullable();
    table.integer('product_id', 11).nullable();

    table.integer('cost_center_id', 11).nullable();
    table.integer('invoice_id', 11).nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.hasTable('acc_plbs_reports').then(async function (exists) {
    if (exists) {
      await knex.schema.alterTable('acc_plbs_reports', (table) => {
        table.dropForeign('company_id');
        table.dropForeign('branch_id');
        table.dropForeign('plbs_code');
      });
      return knex.schema.dropTable('acc_plbs_reports');
    }
  });
}
