import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('fam_asset_assigns', (table) => {
    table.increments('asset_assign_id').notNullable();
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
      .integer('asset_id', 11)
      .unsigned()
      .references('asset_id')
      .inTable('fam_assets')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.date('assign_date').notNullable();
    table.enum('assign_type', ['Assign', 'Transfer)']).defaultTo('Assign');
    table
      .enum('assign_to', ['Employee', 'Branch', 'Department', 'Division'])
      .notNullable();
    table
      .integer('employee_id', 11)
      .unsigned()
      .references('employee_id')
      .inTable('config_employees')
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
    table
      .integer('department_id', 11)
      .unsigned()
      .references('department_id')
      .inTable('sys_departments')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table
      .integer('division_id', 11)
      .unsigned()
      .references('division_id')
      .inTable('sys_divisions')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.text('assign_remarks').nullable();
    table.date('release_date').nullable();
    table.text('release_reason').nullable();
    table.string('assigned_location').nullable();
    table.string('transfer_location').nullable();
    table.specificType('assign_status', 'smallint').nullable();
    table
      .integer('released_by', 11)
      .unsigned()
      .references('user_id')
      .inTable('sys_users')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .index();
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
  await knex.schema.hasTable('fam_asset_assigns').then(async function (exists) {
    if (exists) {
      await knex.schema.alterTable('fam_asset_assigns', (table) => {
        table.dropForeign('company_id');
        table.dropForeign('asset_id');
        table.dropForeign('employee_id');
        table.dropForeign('branch_id');
        table.dropForeign('department_id');
        table.dropForeign('division_id');
        table.dropForeign('released_person');
      });
      return knex.schema.dropTable('fam_asset_assigns');
    }
  });
}
