import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('cd_couriers', (table) => {
    table.increments('courier_id').notNullable();
    table.string('courier_name', 255).notNullable();
    table.text('address').nullable();
    table.string('mobile', 20).notNullable();
    table.text('contact_address').nullable();
    table.string('email', 255).nullable();
    table.string('contact_person', 100).nullable();
    table
      .integer('company_id', 10)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
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
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.hasTable('cd_couriers').then(async function (exists) {
    if (exists) {
      return knex.schema.dropTable('cd_couriers');
    }
  });
}
