import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('sys_forms', (table) => {
    table.increments('form_id');
    table.string('form_slug', 50).unique().notNullable();
    table.string('form_title', 255).unique();
    table
      .integer('company_id', 10)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .nullable()
      .index();
    //default field
    table.integer('created_by', 10).notNullable();
    table.integer('updated_by', 10).nullable();
    table.integer('deleted_by', 10).nullable();
    table.dateTime('created_at').notNullable();
    table.dateTime('updated_at').nullable();
    table.dateTime('deleted_at').nullable();
    table.specificType('status', 'smallint').defaultTo(1);
    //create composite unique index
    // table.index(
    //   ['form_slug', 'company_id'],
    //   'sys_form_slug_company_id_unique_index',
    //   'UNIQUE',
    // );
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.hasTable('sys_forms').then(async function (exists) {
    if (exists) {
      await knex.schema.alterTable('sys_forms', (table) => {
        // table.dropIndex(
        //   ['form_slug', 'company_id'],
        //   'sys_form_slug_company_id_unique_index',
        // );
        table.dropForeign('company_id');
      });
      return knex.schema.dropTable('sys_forms');
    }
  });
}
