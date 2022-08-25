import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('sys_pdf_templates', (table) => {
    table.increments('pdf_templates_id');
    table
      .integer('company_id', 10)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.string('template_slug', 200).nullable();
    table.integer('module_id', 10).nullable();
    table.string('template_title', 255).nullable();
    table.text('template_content', 'longtext').nullable();
    table.text('template_watermark');
    table.string('template_ref_function', 255).nullable();
    //default data
    table.integer('created_by', 10).notNullable();
    table.integer('updated_by', 10).nullable();
    table.integer('deleted_by', 10).nullable();
    table.dateTime('created_at').notNullable();
    table.dateTime('updated_at').nullable();
    table.dateTime('deleted_at').nullable();
    table.specificType('status', 'smallint').defaultTo(1);
    //create composite unique index
    // table.index(
    //   ['template_slug', 'company_id'],
    //   'sys_pdf_company_id_unique_index',
    //   'UNIQUE',
    // );
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.hasTable('sys_pdf_templates').then(async function (exists) {
    if (exists) {
      await knex.schema.alterTable('sys_pdf_templates', (table) => {
        table.dropIndex(
          ['template_slug', 'company_id'],
          'sys_pdf_company_id_unique_index',
        );
        table.dropForeign('company_id');
      });
      return knex.schema.dropTable('sys_pdf_templates');
    }
  });
}
