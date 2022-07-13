import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('acc_tags', (table) => {
    table.increments('tag_id').notNullable();
    table
      .integer('company_id', 10)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.string('tag_name', 50).notNullable().comment('Label Name');
    table.string('track_name', 50).nullable().comment('Identification Name');
    table
      .string('table_name', 50)
      .notNullable()
      .comment('Data source table specific id');
    table
      .string('field_id', 100)
      .notNullable()
      .comment('Data source table specific id');
    table
      .string('field_name', 100)
      .notNullable()
      .comment('Data source table specific value');
    table.specificType('is_plbs', 'smallint').defaultTo(0).nullable();
    table
      .string('voucher_ref_field', 100)
      .notNullable()
      .comment('reference field_name from voucherdetails table');
    //default data
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
  await knex.schema.hasTable('acc_tags').then(async function (exists) {
    if (exists) {
      await knex.schema.alterTable('acc_tags', (table) => {
        table.dropForeign('company_id');
      });
      return knex.schema.dropTable('acc_tags');
    }
  });
}
