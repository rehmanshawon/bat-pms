import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('config_courier_services', (table) => {
    table.increments('courier_service_id').notNullable();
    table
      .integer('company_id', 11)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.string('courier_service_name', 150).nullable();
    table.text('courier_service_address').nullable();
    table.string('courier_contact_no', 20).nullable();
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
    .hasTable('config_courier_services')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable('config_courier_services', (table) => {
          table.dropForeign('company_id');
        });
        return knex.schema.dropTable('config_courier_services');
      }
    });
}
