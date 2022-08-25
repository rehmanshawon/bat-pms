import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('vt_tax_services', (table) => {
    table.increments('tax_service_id');
    table.string('tax_service_code', 20);
    table.enum('tax_type', ['Slub', 'Flat', 'Commission']);
    table.string('tax_head', 100);
    table.string('tax_section', 20);
    table.text('tax_head_description');
    table.decimal('tax_min_slub_amount', 15, 2);
    table.decimal('tax_max_slub_amount', 15, 2);
    table.float('tax_ratio', 5, 2);
    table.float('commission_rate', 5, 2);
    table.float('gross_rate', 5, 2);
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
  await knex.schema.hasTable('vt_tax_services').then(async function (exists) {
    if (exists) {
      return knex.schema.dropTable('vt_tax_services');
    }
  });
}
