import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('csa_file_docs', (table) => {
    table.increments('file_doc_id').notNullable();
    table
      .integer('file_id', 11)
      .unsigned()
      .references('file_id')
      .inTable('csa_files')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .index()
      .notNullable();
    table.string('doc_name', 100).notNullable();
    table.integer('doc_pages', 11).notNullable();
    table.text('doc_description').nullable();
    table.string('attach_file_name', 255).nullable();
    table.string('attach_file_type', 100).nullable();
    table.text('attach_file_path').nullable();
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
  await knex.schema.hasTable('csa_file_docs').then(async function (exists) {
    if (exists) {
      await knex.schema.alterTable('csa_file_docs', (table) => {
        table.dropForeign('company_id');
        table.dropForeign('file_id');
      });
      return knex.schema.dropTable('csa_file_docs');
    }
  });
}
