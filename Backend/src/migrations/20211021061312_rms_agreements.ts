import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('rms_agreements', (table) => {
    table.increments('agreement_id').notNullable();
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
      .integer('premises_id', 11)
      .unsigned()
      .references('premises_id')
      .inTable('rms_premisess')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.string('agreement_code', 100).notNullable();
    table.string('agreement_title', 100).notNullable();
    table.enum('agreement_type', ['Primary', 'Service']).notNullable();
    table.text('description').nullable();
    table.string('memo_number', 50).nullable();
    table.date('memo_date').nullable();
    table.date('commencement_date').nullable();
    table.date('expiry_date').nullable();
    table.date('signing_date').nullable();
    table.date('start_date').nullable();
    table.string('payment_condition', 255).nullable();
    table.integer('renew_alert_before', 11).nullable();
    table.decimal('per_unit_rent', 10, 2).nullable();
    table.decimal('total_area', 10, 2).nullable().defaultTo(0);
    table.string('area_unit', 200).nullable();
    table.string('khotian', 255).nullable();
    table.string('porcha', 255).nullable();
    table.text('remarks').nullable();
    table.integer('status_flow_id', 11).nullable();
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
  await knex.schema.hasTable('rms_agreements').then(async function (exists) {
    if (exists) {
      await knex.schema.alterTable('rms_agreements', (table) => {
        table.dropForeign('company_id');
        table.dropForeign('premises_id');
      });
      return knex.schema.dropTable('rms_agreements');
    }
  });
}
