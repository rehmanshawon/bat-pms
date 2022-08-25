import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('sys_geo_locations', (table) => {
    table.increments('geo_location_id').notNullable();
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
      .string('geo_type', 100)
      .notNullable()
      .comment('get geo_type from sys_configs table');
    table.string('division', 100).notNullable();
    table.string('district', 100).notNullable();
    table.string('thana', 100).notNullable();
    table.string('union', 100).nullable();
    table.string('village', 100).nullable();
    table.string('post_office', 100).nullable();
    table.specificType('post_code', 'smallint').nullable();

    //default columns
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
  await knex.schema.hasTable('sys_geo_locations').then(async function (exists) {
    if (exists) {
      await knex.schema.alterTable('sys_geo_locations', (table) => {
        table.dropForeign('company_id');
      });
      return knex.schema.dropTable('sys_geo_locations');
    }
  });
}
