import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('cd_parcel_manifests', (table) => {
    table.increments('parcel_manifest_id').notNullable();
    table.string('manifest_code', 20).notNullable();
    table.date('manifest_date').notNullable();
    table.text('manifest_remarks').nullable();
    table
      .integer('courier_id', 11)
      .unsigned()
      .references('vendor_id')
      .inTable('config_vendors')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .nullable()
      .index();
    table
      .integer('messenger_id', 11)
      .unsigned()
      .references('user_id')
      .inTable('sys_users')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .nullable()
      .index();
    table.integer('manifest_status', 11).nullable();

    //default Coumn
    table
      .integer('company_id', 10)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
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
    .hasTable('cd_parcel_manifests')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable('cd_parcel_manifests', (table) => {
          table.dropForeign('courier_id');
          table.dropForeign('messenger_id');
        });
        return knex.schema.dropTable('cd_parcel_manifests');
      }
    });
}
