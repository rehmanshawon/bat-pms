import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('fam_maint_visit_reports', (table) => {
    table.increments('maint_visit_report_id').notNullable();
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
      .integer('maint_request_id', 11)
      .unsigned()
      .references('maint_request_id')
      .inTable('fam_maint_requests')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table
      .integer('asset_id', 11)
      .unsigned()
      .references('asset_id')
      .inTable('fam_assets')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .nullable()
      .index();
    table
      .enum('visitor_type', ['Employee', 'Vendor', 'Other'])
      .defaultTo('Employee');
    table
      .integer('employee_id', 11)
      .unsigned()
      .references('user_id')
      .inTable('sys_users')
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
    table.date('visit_date').nullable();
    table.decimal('estimated_cost', 10, 2).nullable();
    table.string('estimated_time', 100).nullable();
    table.string('other_visitor_info', 255).nullable();
    table.text('recommendation').nullable();
    table.text('vendor_finalize_comment').nullable();
    table.text('info_about_visitors').nullable();

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
    .hasTable('fam_maint_visit_reports')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable('fam_maint_visit_reports', (table) => {
          table.dropForeign('company_id');
          table.dropForeign('maint_request_id');
          table.dropForeign('asset_id');
          table.dropForeign('employee_id');
          table.dropForeign('vendor_id');
        });
        return knex.schema.dropTable('fam_maint_visit_reports');
      }
    });
}
