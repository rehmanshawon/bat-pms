import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('rms_agreement_additional_costs', (table) => {
    table.increments('agreement_additional_cost_id');
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
      .integer('cost_component_id', 11)
      .unsigned()
      .references('cost_component_id')
      .inTable('rms_cost_components')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.integer('collector_id', 11).notNullable();
    table.enum('amount_type', ['Fixed', 'Variable']).notNullable();
    table.decimal('amount', 10, 2).notNullable();
    table.specificType('include_in_monthly_rent', 'smallint').notNullable();
    table.specificType('taxable', 'smallint').notNullable();
    table.specificType('is_hold', 'smallint').nullable();
    table.string('hold_from', 100).nullable();
    table.string('hold_to', 100).nullable();
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
    .hasTable('rms_agreement_additional_costs')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable(
          'rms_agreement_additional_costs',
          (table) => {
            table.dropForeign('company_id');
            table.dropForeign('premises_id');
            table.dropForeign('agreement_id');
            table.dropForeign('cost_component_id');
          },
        );
        return knex.schema.dropTable('rms_agreement_additional_costs');
      }
    });
}
