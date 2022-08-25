import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('cd_parcel_receivers', (table) => {
    table.increments('parcel_receiver_id').notNullable();
    table
      .integer('parcel_id', 11)
      .unsigned()
      .references('parcel_id')
      .inTable('cd_parcels')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table
      .integer('receiver_id', 11)
      .unsigned()
      .references('user_id')
      .inTable('sys_users')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .nullable()
      .index();
    table.string('receiver_name', 100).notNullable();
    table
      .integer('receiver_branch_id', 11)
      .unsigned()
      .references('branch_id')
      .inTable('sys_branchs')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .nullable()
      .index();
    table
      .integer('receiver_department_id', 11)
      .unsigned()
      .references('department_id')
      .inTable('sys_departments')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .nullable()
      .index();
    table
      .integer('receiver_geo_location_id', 11)
      .unsigned()
      .references('geo_location_id')
      .inTable('sys_geo_locations')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.text('receiver_address').notNullable();
    table.string('receiver_mobile', 20).notNullable();
    table.text('receiver_remarks').nullable();
    table.date('received_at').nullable();
    table
      .integer('received_by', 11)
      .unsigned()
      .references('user_id')
      .inTable('sys_users')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .nullable()
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
  await knex.schema
    .hasTable('cd_parcel_receivers')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable('cd_parcel_receivers', (table) => {
          table.dropForeign('parcel_id');
          table.dropForeign('receiver_id');
          table.dropForeign('receiver_branch_id');
          table.dropForeign('receiver_department_id');
          table.dropForeign('receiver_geo_location_id');
          table.dropForeign('received_by');
        });
        return knex.schema.dropTable('cd_parcel_receivers');
      }
    });
}
