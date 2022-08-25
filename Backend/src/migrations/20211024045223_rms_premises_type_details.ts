import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('rms_premises_type_details', (table) => {
    table.increments('premises_type_detail_id');
    table
      .integer('company_id', 11)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT').notNullable;
    table
      .integer('premises_type_id', 11)
      .unsigned()
      .references('premises_type_id')
      .inTable('rms_premises_types')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.string('input_field_name', 100).notNullable();
    table.string('input_field_title', 100).notNullable();
    table
      .enu('input_field_type', [
        'text',
        'number',
        'date',
        'datetime',
        'email',
        'textarea',
        'dropdown',
      ])
      .notNullable();
    table.specificType('is_required', 'smallint').notNullable();
    table.string('dropdown_options', 255).notNullable();
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
    .hasTable('rms_premises_type_details')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable('rms_premises_type_details', (table) => {
          table.dropForeign('company_id');
          table.dropForeign('premises_type_id');
        });
        return knex.schema.dropTable('rms_premises_type_details');
      }
    });
}
