import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('cd_parcel_trackers', (table) => {
    table.increments('parcel_tracker_id').notNullable();
    table.integer('parcel_id', 11).notNullable();
    table.integer('parcel_status', 11);
    table.integer('current_branch_id', 11);
    table.integer('current_department_id', 11);
    table.text('current_location');
    table.dateTime('track_time');
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
  await knex.schema
    .hasTable('cd_parcel_trackers')
    .then(async function (exists) {
      if (exists) {
        return knex.schema.dropTable('cd_parcel_trackers');
      }
    });
}
