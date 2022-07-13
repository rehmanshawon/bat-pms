import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('csa_racks', (table) => {
    table.increments('rack_id').notNullable();
    table.string('rack_code', 20).notNullable().unique();
    table.string('rack_name', 100).notNullable();
    table.text('rack_description').nullable();
    table.integer('rack_rows', 11).notNullable();
    table.integer('rack_columns', 11).notNullable();
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
      .integer('warehouse_id', 11)
      .unsigned()
      .references('warehouse_id')
      .inTable('config_warehouses')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .index()
      .notNullable();
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
  await knex.schema.hasTable('csa_racks').then(async function (exists) {
    if (exists) {
      await knex.schema.alterTable('csa_racks', (table) => {
        table.dropForeign('company_id');
        table.dropForeign('warehouse_id');
      });
      return knex.schema.dropTable('csa_racks');
    }
  });
}
