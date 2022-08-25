import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('cd_courier_prices', (table) => {
    table.increments('courier_price_id').notNullable();
    table
      .integer('vendor_id', 10)
      .unsigned()
      .references('vendor_id')
      .inTable('config_vendors')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.integer('parcel_category_id', 11).nullable();
    table.string('geo_location_from', 255).notNullable();
    table.string('geo_location_to', 255).notNullable();
    table.decimal('price', 10, 2).notNullable();
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
  await knex.schema.hasTable('cd_courier_prices').then(async function (exists) {
    if (exists) {
      return knex.schema.dropTable('cd_courier_prices');
    }
  });
}
