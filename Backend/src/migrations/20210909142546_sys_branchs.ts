import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('sys_branchs', (table) => {
    table.increments('branch_id');
    table
      .integer('company_id', 10)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.string('branch_code', 20).unique().nullable();
    table.string('branch_name', 100).notNullable();
    table.string('branch_short_name', 5).nullable();
    table.integer('parent_branch_id').index().defaultTo(0).nullable();
    table
      .enum('branch_type', ['Branch', 'Uposhakha'])
      .defaultTo('Branch')
      .notNullable();
    table
      .integer('geo_location_id', 10)
      .unsigned()
      .references('geo_location_id')
      .inTable('sys_geo_locations')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    // table
    //   .integer('dispatch_manager_id', 11)
    //   .unsigned()
    //   .references('employee_id')
    //   .inTable('config_employees')
    //   .onDelete('RESTRICT')
    //   .onUpdate('RESTRICT')
    //   .notNullable()
    //   .index();
    table.text('branch_address').nullable();
    table.text('branch_contact').nullable();
    table.integer('branch_mobile', 11).nullable();
    table.integer('created_by', 10).notNullable();
    table.integer('updated_by', 10).nullable();
    table.integer('deleted_by', 10).nullable();
    table.dateTime('created_at').notNullable().defaultTo(knex.fn.now());
    table.dateTime('updated_at').nullable();
    table.dateTime('deleted_at').nullable();
    table.specificType('status', 'smallint').defaultTo(1);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.hasTable('sys_branchs').then(async function (exists) {
    if (exists) {
      await knex.schema.alterTable('sys_branchs', (table) => {
        table.dropForeign('company_id');
        table.dropForeign('geo_location_id');
        // table.dropForeign('dispatch_manager_id');
      });
      return knex.schema.dropTable('sys_branchs');
    }
  });
}
