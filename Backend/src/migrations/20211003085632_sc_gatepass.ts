import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('sc_gatepass', (table) => {
    table.increments('gatepass_id').notNullable();
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
      .integer('challan_id', 11)
      .unsigned()
      .unique()
      .references('challan_id')
      .inTable('sc_challans')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .index();
    table.string('gatepass_code', 20).notNullable();
    table.dateTime('dispass_at').nullable();
    table.string('driver_name', 100).nullable();
    table.string('driver_mobile', 20).nullable();
    table.string('vehicle_number', 100).nullable();
    table.string('helper_name', 100).nullable();
    table.string('helper_mobile', 20).nullable();
    table.text('remarks').nullable();
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
  await knex.schema.hasTable('sc_gatepass').then(async function (exists) {
    if (exists) {
      await knex.schema.alterTable('sc_gatepass', (table) => {
        table.dropForeign('company_id');
        table.dropForeign('challan_id');
      });
      return knex.schema.dropTable('sc_gatepass');
    }
  });
}
