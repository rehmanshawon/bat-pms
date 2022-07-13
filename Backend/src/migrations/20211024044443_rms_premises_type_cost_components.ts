import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    'rms_premises_type_cost_components',
    (table) => {
      table.increments('premises_type_cost_component_id');
      table
        .integer('company_id', 11)
        .unsigned()
        .references('company_id')
        .inTable('sys_companys')
        .onDelete('RESTRICT')
        .onUpdate('RESTRICT')
        .notNullable()
        .index();
      table
        .integer('premises_type_id', 11)
        .unsigned()
        .references('premises_type_id')
        .inTable('rms_premises_types')
        .onDelete('RESTRICT')
        .onUpdate('RESTRICT')
        .notNullable()
        .index();
      table
        .integer('cost_component_id', 11)
        .unsigned()
        .references('cost_component_id')
        .inTable('rms_cost_components')
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
    },
  );
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema
    .hasTable('rms_premises_type_cost_components')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable(
          'rms_premises_type_cost_components',
          (table) => {
            table.dropForeign('company_id');
            table.dropForeign('premises_type_id');
            table.dropForeign('cost_component_id');
          },
        );
        return knex.schema.dropTable('rms_premises_type_cost_components');
      }
    });
}
