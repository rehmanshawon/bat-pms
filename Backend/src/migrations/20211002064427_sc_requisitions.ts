import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('sc_requisitions', (table) => {
    table.increments('requisition_id').notNullable();
    table
      .integer('company_id', 10)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.string('requisition_code', 20).notNullable();
    table
      .integer('parent_requisition_id', 11)
      .unsigned()
      .references('requisition_id')
      .inTable('sc_requisitions')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .index();
    table
      .integer('requisition_type_id', 11)
      .unsigned()
      .references('requisition_type_id')
      .inTable('sc_requisition_types')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .index()
      .notNullable();
    table
      .enum('requisition_for', ['Branch', 'Department', 'Division', 'Person'])
      .nullable();
    // table.integer('requisition_branch_id', 11).nullable();
    table
      .integer('requisition_branch_id', 10)
      .unsigned()
      .references('branch_id')
      .inTable('sys_branchs')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    //table.integer('requisition_department_id', 11).nullable();
    table
      .integer('requisition_department_id', 10)
      .unsigned()
      .references('department_id')
      .inTable('sys_departments')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .index();
    // table.integer('requisition_division_id', 11).nullable();
    table
      .integer('requisition_division_id', 10)
      .unsigned()
      .references('division_id')
      .inTable('sys_divisions')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .nullable()
      .index();
    table
      .integer('requisition_person_id', 11)
      .unsigned()
      .references('employee_id')
      .inTable('config_employees')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .nullable()
      .index();
    table.date('requisition_date').notNullable();
    table.date('expected_delivery_date').notNullable();
    table.text('purpose').nullable();
    table.text('remarks').nullable();
    table.specificType('requisition_status', 'smallint').notNullable();
    table.specificType('is_frequently', 'smallint').nullable().comment('0/1');
    table
      .integer('frequently_period', 11)
      .nullable()
      .comment('days like 7/15/30/60');
    table.date('frequently_end_date').nullable();
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
  await knex.schema.hasTable('sc_requisitions').then(async function (exists) {
    if (exists) {
      await knex.schema.alterTable('sc_requisitions', (table) => {
        table.dropForeign('company_id');
        table.dropForeign('parent_requisition_id');
        table.dropForeign('requisition_branch_id');
        table.dropForeign('requisition_department_id');
        table.dropForeign('requisition_division_id');
        table.dropForeign('requisition_type_id');
        table.dropForeign('requisition_person_id');
      });
      return knex.schema.dropTable('sc_requisitions');
    }
  });
}
