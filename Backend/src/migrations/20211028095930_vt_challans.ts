import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('vt_challans', (table) => {
    table.increments('challan_id').notNullable();
    table.string('challan_number', 20).notNullable();
    table.string('challan_month', 20).notNullable();
    table.date('deposit_date').notNullable();
    table.string('deposit_bank', 100).notNullable();
    table.string('deposit_branch', 100).notNullable();
    table.enu('challan_for', ['VAT', 'TAX']).notNullable();
    table
      .integer('depositor_id', 11)
      .unsigned()
      .references('employee_id')
      .inTable('config_employees')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.string('deposit_type', 100).notNullable();
    table.string('deposit_by', 100).notNullable();
    table.text('deposit_note');
    table.decimal('deposit_amount', 15, 2).notNullable();
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
  await knex.schema.hasTable('vt_challans').then(async function (exists) {
    if (exists) {
      await knex.schema.alterTable('vt_challans', (table) => {
        table.dropForeign('depositor_id');
      });
      return knex.schema.dropTable('vt_challans');
    }
  });
}
