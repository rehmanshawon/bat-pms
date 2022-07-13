import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('sys_form_metas', (table) => {
    table.increments('form_meta_id');
    table
      .integer('company_id', 10)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table
      .string('form_slug', 50)
      .notNullable()
      .comment('sys_forms table form slug');
    table
      .integer('reference_id', 10)
      .notNullable()
      .comment('reference form saved data');
    table.string('input_label', 100).notNullable();
    table.string('input_value', 255).notNullable();

    //default Coumn
    table.integer('created_by', 10).notNullable();
    table.dateTime('created_at').notNullable();
    table.specificType('status', 'smallint').defaultTo(1);
    //create composite unique index
    // table.index(
    //   ['form_slug', 'company_id'],
    //   'sys_form_meta_company_id_unique_index',
    //   'UNIQUE',
    // );
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.hasTable('sys_form_metas').then(async function (exists) {
    if (exists) {
      await knex.schema.alterTable('sys_form_metas', (table) => {
        // table.dropIndex(
        //   ['form_slug', 'company_id'],
        //   'sys_form_meta_company_id_unique_index',
        // );
        table.dropForeign('company_id');
      });
      return knex.schema.dropTable('sys_form_metas');
    }
  });
}
