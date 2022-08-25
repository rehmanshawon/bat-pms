import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('rms_agreement_ccs', (table) => {
    table.increments('agreement_cc_id').notNullable();
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
      .integer('cost_center_id', 11)
      .unsigned()
      .references('cost_center_id')
      .inTable('rms_cost_centers')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.string('allocation', 50).notNullable();
    table.decimal('amount', 15, 5).nullable();
    table.integer('total_rent_by_agreement', 11).notNullable();
    table.integer('total_rent_by_premises', 11).notNullable();
    //default table
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
  await knex.schema.hasTable('rms_agreement_ccs').then(async function (exists) {
    if (exists) {
      await knex.schema.alterTable('rms_agreement_ccs', (table) => {
        table.dropForeign('company_id');
        table.dropForeign('premises_id');
        table.dropForeign('agreement_id');
        table.dropForeign('cost_center_id');
      });
      return knex.schema.dropTable('rms_agreement_ccs');
    }
  });
}
