import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('vt_vat_services', (table) => {
    table.increments('service_id');
    table.string('vat_service_code', 20);
    table.string('service_code', 20);
    table.string('service_name', 255);
    table.string('service_name_bn', 255);
    table.text('service_description');
    table.text('service_explanation');
    table.text('service_description_bn');
    table.text('service_explanation_bn');
    table.float('vat_ratio', 5, 2);
    table.date('applicable_date');
    table
      .integer('company_id', 11)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();

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
  await knex.schema.hasTable('vt_vat_services').then(async function (exists) {
    if (exists) {
      return knex.schema.dropTable('vt_vat_services');
    }
  });
}
