import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('sc_requisition_item_ccs', (table) => {
    table.increments('requisition_item_cc_id').notNullable();
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
      .integer('requisition_item_id', 11)
      .unsigned()
      .references('requisition_item_id')
      .inTable('sc_requisition_items')
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
      .bigInteger('account_code')
      .references('account_code')
      .inTable('acc_chart_of_accounts')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.decimal('allocation_ratio', 5, 2).nullable();
    table.decimal('allocation_amount', 15, 2).nullable();
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
    .hasTable('sc_requisition_item_ccs')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable('sc_requisition_item_ccs', (table) => {
          table.dropForeign('company_id');
          table.dropForeign('requisition_item_id');
          table.dropForeign('branch_id');
          table.dropForeign('cost_center_id');
          table.dropForeign('account_code');
        });
        return knex.schema.dropTable('sc_requisition_item_ccs');
      }
    });
}
