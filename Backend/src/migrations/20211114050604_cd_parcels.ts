import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('cd_parcels', (table) => {
    table.increments('parcel_id').notNullable();
    table.string('parcel_code', 20).notNullable();
    table.enu('parcel_type', ['Send', 'Received']).notNullable();
    table.integer('parcel_category_id', 11).nullable();
    table.string('parcel_title', 255).nullable();
    table.text('parcel_details').nullable();
    table.enu('sender_type', ['Internal', 'External']).notNullable();
    table
      .integer('sender_id', 11)
      .unsigned()
      .references('user_id')
      .inTable('sys_users')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .index();
    table.string('sender_name', 100).nullable();
    table
      .integer('sender_branch_id', 11)
      .unsigned()
      .references('branch_id')
      .inTable('sys_branchs')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .nullable()
      .index();
    table
      .integer('sender_department_id', 11)
      .unsigned()
      .references('department_id')
      .inTable('sys_departments')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .nullable()
      .index();
    table
      .integer('sender_geo_location_id', 11)
      .unsigned()
      .references('geo_location_id')
      .inTable('sys_geo_locations')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .nullable()
      .index();
    table.text('sender_address').nullable();
    table.string('sender_mobile', 20).nullable();
    table.text('sender_remarks').nullable();
    table.enu('receiver_type', ['Internal', 'External']).nullable();
    table
      .integer('courier_id', 11)
      .unsigned()
      .references('vendor_id')
      .inTable('config_vendors')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .nullable()
      .index();
    table.decimal('courier_price', 10, 2).nullable();
    table.integer('parcel_status', 11).nullable();
    table
      .integer('company_id', 10)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.enu('send_by', ['Messenger', 'Courier', 'System']).nullable();
    table
      .integer('messenger_id', 11)
      .unsigned()
      .references('user_id')
      .inTable('sys_users')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .nullable()
      .index();
    table
      .integer('dispatch_manager_id', 11)
      .unsigned()
      .references('user_id')
      .inTable('sys_users')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .nullable()
      .index();

    table.boolean('is_softcopy').nullable();
    table.enu('priority', ['High', 'Medium', 'Low', 'Urgent']).notNullable();
    table.boolean('is_confidential').nullable();
    table
      .integer('parcel_manifest_id', 11)
      .unsigned()
      .references('parcel_manifest_id')
      .inTable('cd_parcel_manifests')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .nullable()
      .index();
    table.string('ref_table_name', 100).nullable();
    table.string('ref_col_name', 100).nullable();
    table.string('ref_id', 20).nullable();
    table.string('parcel_ref', 200).nullable();

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
  await knex.schema.hasTable('cd_parcels').then(async function (exists) {
    if (exists) {
      await knex.schema.alterTable('cd_parcels', (table) => {
        table.dropForeign('company_id');
        table.dropForeign('sender_id');
        table.dropForeign('courier_id');
        table.dropForeign('sender_branch_id');
        table.dropForeign('sender_department_id');
        table.dropForeign('sender_geo_location_id');
        table.dropForeign('parcel_manifest_id');
        table.dropForeign('messenger_id');
      });
      return knex.schema.dropTable('cd_parcels');
    }
  });
}
