import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('csa_file_requisitions', (table) => {
    table.increments('file_requisition_id').notNullable();
    table
      .integer('company_id', 10)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.string('file_requisition_code', 20).notNullable();
    table.string('file_issued_code', 20).notNullable();
    table.string('file_return_code', 20).notNullable();
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
      .index();
    table
      .integer('division_id', 11)
      .unsigned()
      .references('division_id')
      .inTable('sys_divisions')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .index();
    table.text('requisition_purpose').notNullable();
    table.text('requisition_remarks').notNullable();
    table.text('file_keywords').notNullable();
    table.date('requisition_date').notNullable();
    table.date('from_date').notNullable();
    table.date('to_date').notNullable();
    table.integer('file_requisition_status', 11).nullable();
    table.integer('file_issued_status', 11).nullable();
    table
      .integer('file_category_id', 11)
      .unsigned()
      .references('file_category_id')
      .inTable('csa_file_categorys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table
      .integer('file_doc_id', 11)
      .unsigned()
      .references('file_doc_id')
      .inTable('csa_file_docs')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.date('extended_date').nullable();
    table.text('extend_reason').nullable();
    table
      .integer('issued_by', 11)
      .unsigned()
      .references('user_id')
      .inTable('sys_users')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .index();
    table.text('issue_remarks').nullable();
    table
      .integer('send_parcel_id', 11)
      .unsigned()
      .references('parcel_id')
      .inTable('cd_parcels')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .index();
    table
      .integer('return_parcel_id', 11)
      .unsigned()
      .references('parcel_id')
      .inTable('cd_parcels')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .index();
    table.text('file_received_remarks').nullable();
    table
      .integer('file_received_by', 11)
      .unsigned()
      .references('user_id')
      .inTable('sys_users')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .index();
    table.dateTime('file_received_at').nullable();
    table
      .integer('return_file_received_by', 11)
      .unsigned()
      .references('user_id')
      .inTable('sys_users')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .index();
    table.dateTime('return_file_received_at').nullable();
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
    .hasTable('csa_file_requisitions')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable('csa_file_requisitions', (table) => {
          table.dropForeign('company_id');
          table.dropForeign('branch_id');
          table.dropForeign('department_id');
          table.dropForeign('division_id');
          table.dropForeign('file_category_id');
          table.dropForeign('issued_by');
          table.dropForeign('send_parcel_id');
          table.dropForeign('return_parcel_id');
          table.dropForeign('file_received_by');
          table.dropForeign('return_file_received_by');
        });
        return knex.schema.dropTable('csa_file_requisitions');
      }
    });
}
