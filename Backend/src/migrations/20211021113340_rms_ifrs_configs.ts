import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('rms_ifrs_configs', (table) => {
    table.increments('ifrs_config_id');
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
    table.date('agreement_start_date').notNullable();
    table.date('agreement_expiry_date').notNullable();
    table.date('cut_of_date').notNullable();
    table.integer('cut_of_total_month', 11).notNullable();
    table.integer('previous_monthly_rent', 11).notNullable();
    table.integer('after_monthly_rent', 11).notNullable();
    table.integer('unadjustment_amout', 11).notNullable();
    table.decimal('discount_rate', 18, 6).notNullable();
    table.decimal('interest_rate', 18, 6).notNullable();
    table.decimal('total_present_value', 18, 6).notNullable();
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
  await knex.schema.hasTable('rms_ifrs_configs').then(async function (exists) {
    if (exists) {
      await knex.schema.alterTable('rms_ifrs_configs', (table) => {
        table.dropForeign('company_id');
        table.dropForeign('premises_id');
        table.dropForeign('agreement_id');
      });
      return knex.schema.dropTable('rms_ifrs_configs');
    }
  });
}
