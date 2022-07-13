import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('sys_users', (table) => {
    table.increments('user_id');
    table.string('user_code', 20).unique().notNullable();
    table.string('user_name', 100).unique().notNullable();
    table.string('email', 100).unique().notNullable();
    table.string('password', 100).notNullable();
    table.string('full_name', 100).notNullable();
    table.string('mobile', 20).nullable();
    table
      .integer('company_id', 10)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.date('date_of_birth').nullable();
    table.dateTime('verified_at').nullable();
    table.enum('gender', ['Male', 'Female']).nullable();
    table.string('user_image', 100).nullable();
    table.string('refresh_token', 255).nullable();
    table.string('password_reset_token', 255).nullable();
    table.dateTime('password_reset_token_expiry_date').nullable();
    table
      .integer('designation_id', 10)
      .unsigned()
      .references('designation_id')
      .inTable('sys_designation')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
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
      .integer('department_id', 10)
      .unsigned()
      .references('department_id')
      .inTable('sys_departments')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .index();
    table
      .integer('division_id', 10)
      .unsigned()
      .references('division_id')
      .inTable('sys_divisions')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .index();
    table
      .integer('default_module_id', 10)
      .nullable()
      .comment('default module id for the user');
    table.integer('is_reliever', 11).nullable();
    table.integer('reliever_to', 11).nullable();
    table.dateTime('reliever_start_datetime').nullable();
    table.dateTime('reliever_end_datetime').nullable();
    table.integer('line_manager_id', 11).notNullable();

    //default data
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
  await knex.schema.hasTable('sys_users').then(async function (exists) {
    if (exists) {
      await knex.schema.alterTable('sys_users', (table) => {
        table.dropForeign('company_id');
        table.dropForeign('branch_id');
        table.dropForeign('department_id');
        table.dropForeign('division_id');
      });
      return knex.schema.dropTable('sys_users');
    }
  });
}
