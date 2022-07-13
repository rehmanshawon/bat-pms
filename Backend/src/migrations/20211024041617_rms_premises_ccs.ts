import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('rms_premises_ccs', (table) => {
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
    table
      .integer('cost_center_id', 11)
      .unsigned()
      .references('cost_center_id')
      .inTable('rms_cost_centers')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.integer('rent_amount', 11).notNullable();
    table.integer('expanse_ratio', 11).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.hasTable('rms_premises_ccs').then(async function (exists) {
    if (exists) {
      await knex.schema.alterTable('rms_premises_ccs', (table) => {
        table.dropForeign('company_id');
        table.dropForeign('premises_id');
        table.dropForeign('cost_center_id');
      });
      return knex.schema.dropTable('rms_premises_ccs');
    }
  });
}
