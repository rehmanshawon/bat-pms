import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('pms_bill_cc_lists', (table) => {
    table.increments('bill_cc_list_id').notNullable();
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
      .integer('bill_details_id', 11)
      .unsigned()
      .references('bill_details_id')
      .inTable('pms_bill_details')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .index();
    table.integer('branch_id', 11);
    table
      .integer('cost_center_id', 11)
      .unsigned()
      .references('cost_center_id')
      .inTable('config_cost_centers')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table
      .bigInteger('gl_code')
      .references('account_code')
      .inTable('acc_chart_of_accounts')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.decimal('branch_cc_percentage', 5, 2).nullable();
    table.decimal('amount', 15, 2).nullable();
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
  await knex.schema.hasTable('pms_bill_cc_lists').then(async function (exists) {
    if (exists) {
      await knex.schema.alterTable('pms_bill_cc_lists', (table) => {
        table.dropForeign('company_id');
        table.dropForeign('bill_details_id');
        table.dropForeign('cost_center_id');
        table.dropForeign('gl_code');
      });
      return knex.schema.dropTable('pms_bill_cc_lists');
    }
  });
}
