import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('config_product_specifications', (table) => {
    table.increments('product_specification_id').notNullable();
    table
      .integer('company_id', 10)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.string('spec_ref', 100).notNullable();
    table.integer('spec_ref_id', 11).notNullable();
    table.string('spec_name', 100).notNullable();
    table.string('spec_unit', 100).nullable();
    table.string('spec_standard', 255).nullable();
    table.string('spec_value', 255).nullable();
    table
      .enum('spec_input_type', [
        'input',
        'date',
        'number',
        'textarea',
        'dropdown',
      ])
      .nullable();
    table.text('dropdown_options');
    table.specificType('editable', 'smallint').defaultTo(1);
    //default data
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
    .hasTable('config_product_specifications')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable(
          'config_product_specifications',
          (table) => {
            table.dropForeign('company_id');
          },
        );
        return knex.schema.dropTable('config_product_specifications');
      }
    });
}
