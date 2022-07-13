import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('rms_agreement_rental_schedules', (table) => {
    table.increments('agreement_rental_schedule_id').notNullable();
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
      .integer('premises_id')
      .unsigned()
      .references('premises_id')
      .inTable('rms_premisess')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table
      .integer('agreement_id', 11)
      .unsigned()
      .references('agreement_id')
      .inTable('rms_agreements')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table
      .integer('owners_info_id', 11)
      .unsigned()
      .references('owners_info_id')
      .inTable('rms_owners_infos')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.string('payment_month', 7).notNullable();
    table.integer('monthly_rent', 11).notNullable();
    table.decimal('adjustment_amount', 18, 6).notNullable();
    table.decimal('payable_amount', 18, 6).notNullable();
    table.decimal('pv_factor_ad', 18, 6).nullable();
    table.decimal('pv_factor_oa', 18, 6).nullable();
    table.specificType('is_invoice', 'smallint').nullable();
    table.specificType('is_hold', 'smallint').nullable();
    table.string('hold_from', 100).notNullable();
    table.string('hold_to', 100).nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema
    .hasTable('rms_agreement_rental_schedules')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable(
          'rms_agreement_rental_schedules',
          (table) => {
            table.dropForeign('company_id');
            table.dropForeign('premises_id');
            table.dropForeign('agreement_id');
            table.dropForeign('owners_info_id');
          },
        );
        return knex.schema.dropTable('rms_agreement_rental_schedules');
      }
    });
}
