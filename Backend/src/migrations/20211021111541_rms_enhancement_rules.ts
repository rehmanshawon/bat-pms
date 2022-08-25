import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('rms_enhancement_rules', (table) => {
    table.increments('enhancement_rule_id');
    table
      .integer('company_id', 11)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.enum('enhancement_rule', ['Auto', 'Manual']).nullable();
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
    table.string('effictive_month', 50).notNullable();
    table.decimal('previous_rent', 10, 2).notNullable();
    table.enum('increase_type', ['ratio', 'fixed']).nullable();
    table.integer('ratio_value', 10).notNullable();
    table.enum('base_rent', ['starting_rent', 'previous_rent']).nullable();
    table.decimal('amount', 10, 2).notNullable();
    table.decimal('current_rent', 10, 2).notNullable();
    table.string('comments', 255).notNullable();
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
    .hasTable('rms_enhancement_rules')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable('rms_enhancement_rules', (table) => {
          table.dropForeign('company_id');
          table.dropForeign('premises_id');
          table.dropForeign('agreement_id');
        });
        return knex.schema.dropTable('rms_enhancement_rules');
      }
    });
}
