import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('sys_search_panel_details', (table) => {
    table.increments('search_panel_detail_id');
    table
      .string('search_panel_slug', 50)
      .references('search_panel_slug')
      .inTable('sys_search_panels')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
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
    table.specificType('column_space', 'smallint').defaultTo(3).notNullable();
    table.string('label_name', 50).notNullable();
    table.string('label_class', 50).nullable();
    table
      .enum('input_type', [
        'dropdown',
        'text',
        'autocomplete',
        'textarea',
        'email',
        'date',
        'datetime',
        'checkbox',
        'radio',
        'button',
        'number',
        'submit',
        'date_range',
        'number_range',
        'text_range',
        'month',
        'year',
        'time',
      ])
      .defaultTo('text')
      .notNullable();
    table.string('input_name', 50).notNullable();
    table.string('input_default_val', 100).nullable();
    table.string('input_id', 50).nullable();
    table.string('input_class', 100).nullable();
    table.string('input_placeholder', 100).nullable();
    table
      .enum('input_operation_type', [
        'WHERE EQUAL',
        'WHERE IN',
        'WHERE LIKE',
        'WHERE DATERANGE',
        'WHERE RANGE',
        'WHERE DATETIME',
        'HAVING EQUAL',
        'HAVING LIKE',
        'HAVING DATERANGE',
        'HAVING IN',
        'HAVING RANGE',
        'HAVING DATETIME',
        'WHERE TIME',
      ])
      .defaultTo('WHERE LIKE')
      .notNullable();
    table.specificType('single_compare', 'smallint').defaultTo(0).notNullable();
    table.specificType('sorting', 'smallint').defaultTo(0).notNullable();
    table.specificType('required', 'smallint').defaultTo(0).notNullable();
    table
      .string('dropdown_slug')
      .references('dropdown_slug')
      .inTable('sys_dropdowns')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .index();
    table.text('dropdown_options').notNullable();
    table.specificType('multiple', 'smallint').defaultTo(0).notNullable();
    //default field
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
    .hasTable('sys_search_panel_details')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable('sys_search_panel_details', (table) => {
          table.dropForeign('search_panel_slug');
          table.dropForeign('company_id');
        });
        return knex.schema.dropTable('sys_search_panel_details');
      }
    });
}
