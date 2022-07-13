import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('fam_maint_requests', (table) => {
    table.increments('maint_request_id').notNullable();
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
      .integer('asset_assign_id', 11)
      .unsigned()
      .references('asset_assign_id')
      .inTable('fam_asset_assigns')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.string('maint_request_code', 20).nullable();
    table.integer('asset_id', 11).nullable();
    table.text('issue_highlight').nullable().comment('comma seperated text');
    table.text('remarks').nullable();
    table.integer('maint_request_status', 4).nullable();
    table.enum('warranty_claim', ['No', 'Yes']).defaultTo('No').nullable();
    table
      .integer('work_order_id', 11)
      .unsigned()
      .references('work_order_id')
      .inTable('fam_work_orders')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .index();
    table.string('maint_req_priority', 110).nullable();
    table.decimal('maint_cost', 15, 2).nullable();
    table.decimal('maint_other_cost', 15, 2).nullable();
    table.date('received_date').nullable();
    table.date('maint_request_date').notNullable();
    table.date('maint_complete_date').notNullable();
    table.date('next_maint_date').notNullable();
    table.text('received_remarks').nullable();
    table.text('request_close_remarks').nullable();
    table.integer('gate_pass_id', 11).nullable();
    table.integer('selected_vendor_id', 11).nullable();
    table.integer('resolved_by', 11).nullable();
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
    .hasTable('fam_maint_requests')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable('fam_maint_requests', (table) => {
          table.dropForeign('company_id');
          table.dropForeign('asset_assign_id');
          table.dropForeign('work_order_id');
        });
        return knex.schema.dropTable('fam_maint_requests');
      }
    });
}
