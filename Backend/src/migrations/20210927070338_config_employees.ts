import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('config_employees', (table) => {
    table.increments('employee_id').notNullable();
    table
      .integer('company_id', 10)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.string('employee_name', 100).notNullable();
    table.string('employee_code', 20).notNullable();
    table.string('mobile', 20).nullable();
    table.string('email', 255).unique().notNullable();
    table.date('joining_date').nullable();
    table.string('f_name', 100).notNullable();
    table.string('m_name', 100).notNullable();
    table.string('spouse_name', 100).nullable();
    table.enum('gender', ['Male', 'Female']).notNullable();
    table
      .enum('marital_status', [
        'Married',
        'Unmarried',
        'Devorced',
        'Widow',
        'Single',
      ])
      .notNullable();
    table
      .enum('blood_group', ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'])
      .notNullable();
    table
      .enum('religion', ['Buddhist', 'Christian', 'Hindu', 'Islam', 'Others'])
      .notNullable();
    table.string('nationality', 100).notNullable();
    table.string('nid', 20).nullable();
    table.string('tin', 20).nullable();
    table.string('passport', 20).nullable();
    table.string('present_address', 255).nullable();
    table.string('permanant_address', 255).nullable();
    table
      .integer('department_id', 11)
      .unsigned()
      .references('department_id')
      .inTable('sys_departments')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .index();
    table
      .integer('division_id', 11)
      .unsigned()
      .references('division_id')
      .inTable('sys_divisions')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
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
      .integer('designation_id', 11)
      .unsigned()
      .references('designation_id')
      .inTable('sys_designation')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
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
  await knex.schema.hasTable('config_employees').then(async function (exists) {
    if (exists) {
      await knex.schema.alterTable('config_employees', (table) => {
        table.dropForeign('company_id');
        table.dropForeign('department_id');
        table.dropForeign('division_id');
        table.dropForeign('branch_id');
        table.dropForeign('designation_id');
      });
      return knex.schema.dropTable('config_employees');
    }
  });
}
