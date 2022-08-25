import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('csa_files', (table) => {
    table.increments('file_id').notNullable();
    table.string('file_code', 20).notNullable().unique();
    table.string('file_name', 100).notNullable();
    table
      .integer('file_category_id', 10)
      .unsigned()
      .references('file_category_id')
      .inTable('csa_file_categorys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.enum('file_type', ['ERP', 'Manual']).notNullable();
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
    table.text('file_keywords').nullable();
    table.text('file_description').nullable();
    table
      .enum('file_status', ['New', 'Box', 'Unbox'])
      .defaultTo('New')
      .nullable();
    table
      .integer('box_id', 10)
      .unsigned()
      .references('box_id')
      .inTable('csa_boxs')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table
      .integer('company_id', 10)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
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
  await knex.schema.hasTable('csa_files').then(async function (exists) {
    if (exists) {
      await knex.schema.alterTable('csa_files', (table) => {
        table.dropForeign('file_category_id');
        table.dropForeign('branch_id');
        table.dropForeign('department_id');
        table.dropForeign('division_id');
        table.dropForeign('box_id');
        table.dropForeign('company_id');
      });
      return knex.schema.dropTable('csa_files');
    }
  });
}
