import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('config_vendors', (table) => {
    table.increments('vendor_id').notNullable();
    table
      .integer('company_id', 10)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.string('vendor_name', 100).notNullable();
    table.string('vendor_code', 20).unique().notNullable();
    table.string('vendor_contact', 20).nullable();
    table.string('vendor_address', 255).nullable();
    table.string('vendor_email', 255).nullable();
    table.string('vendor_type', 100).notNullable();
    table.string('tin_number', 100).nullable();
    table.string('bin_number', 100).nullable();
    table.string('owner_name', 100).nullable();
    table.string('owner_contact', 20).nullable();
    table.string('default_currency_code', 10).nullable();
    table.string('vendor_country', 100).nullable();
    table.text('vendor_remarks').nullable();
    table.string('license_number', 100).nullable();
    table.date('license_issue_date').nullable();
    table.date('license_expiry_date').nullable();
    table.string('license_issue_place', 100).nullable();

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
  await knex.schema.hasTable('config_vendors').then(async function (exists) {
    if (exists) {
      await knex.schema.alterTable('config_vendors', (table) => {
        table.dropForeign('company_id');
      });
      return knex.schema.dropTable('config_vendors');
    }
  });
}
