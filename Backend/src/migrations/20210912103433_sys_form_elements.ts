import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('sys_form_elements', (table) => {
    table.increments('form_element_id');
    table
      .string('form_slug', 50)
      .notNullable()
      .references('form_slug')
      .inTable('sys_forms')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .index();
    table
      .integer('company_id', 10)
      .nullable()
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .index();
    table.string('form_element_section', 50).notNullable();
    table
      .integer('element_column', 11)
      .notNullable()
      .comment('number of column e.g 2/3/4/5/6');
    table.string('label_name', 50).notNullable();
    table.string('label_class', 50).nullable();
    table
      .enum('input_type', [
        'text',
        'textarea',
        'email',
        'date',
        'datetime',
        'checkbox',
        'radio',
        'button',
        'number',
        'submit',
        'autocomplete',
        'select',
        'multi_select',
        'dropdown_grid',
        'daterange',
        'texteditor',
        'tree',
      ])
      .notNullable();
    table.string('input_name', 50).notNullable();
    table.string('input_label', 150).nullable();
    table.string('input_value', 150).nullable();
    table.specificType('multiple', 'smallint').defaultTo(0).comment('1/0');
    table.string('input_placeholder', 50).nullable();
    table.string('input_id', 50).nullable();
    table.string('input_class', 50).nullable();
    table
      .text('input_function')
      .nullable()
      .comment(
        'put the function name which is defined in form validator helper',
      );
    table.string('element_class', 50).nullable();
    table.integer('sort_number', 11).notNullable();
    table
      .string('input_expression', 100)
      .nullable()
      .comment('put the regular expression for the input validation');
    table.specificType('disabled', 'smallint').defaultTo(0).nullable();
    table.specificType('required', 'smallint').defaultTo(0).nullable();
    table.string('dropdown_slug', 50).nullable();
    table.text('dropdown_options').notNullable();
    table.text('validation_rules', 'longtext').nullable();
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
  await knex.schema.hasTable('sys_form_elements').then(async function (exists) {
    if (exists) {
      await knex.schema.alterTable('sys_form_elements', (table) => {
        table.dropForeign('company_id');
        table.dropForeign('form_slug');
      });
      return knex.schema.dropTable('sys_form_elements');
    }
  });
}
