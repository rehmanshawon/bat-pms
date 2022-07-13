import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('rms_cost_components', (table) => {
    table.increments('cost_component_id').notNullable();
    table
      .integer('company_id', 11)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.string('cost_component_name', 100).notNullable();
    table.string('cost_component_code', 20).notNullable();
    table.integer('cost_component_parent', 11).notNullable();
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
    .hasTable('rms_cost_components')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable('rms_cost_components', (table) => {
          table.dropForeign('company_id');
        });
        return knex.schema.dropTable('rms_cost_components');
      }
    });
}
