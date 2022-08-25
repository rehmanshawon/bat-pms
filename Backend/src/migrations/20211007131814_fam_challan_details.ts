import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('fam_challan_details', (table) => {
    table.increments('challan_detail_id').notNullable();
    table
      .integer('company_id', 11)
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
      .references('challan_id')
      .inTable('fam_challans')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .nullable()
      .index();
    table
      .integer('asset_id', 11)
      .unsigned()
      .references('asset_id')
      .inTable('fam_assets')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .nullable()
      .index();
    table
      .integer('maint_request_id', 11)
      .unsigned()
      .references('maint_request_id')
      .inTable('fam_maint_requests')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .nullable()
      .index();
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
  await knex.schema
    .hasTable('fam_challan_details')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable('fam_challan_details', (table) => {
          table.dropForeign('company_id');
          table.dropForeign('challan_id');
          table.dropForeign('asset_id');
          table.dropForeign('maint_request_id');
        });
        return knex.schema.dropTable('fam_challan_details');
      }
    });
}
