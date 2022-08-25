import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('rms_premisess', (table) => {
    table.increments('premises_id').notNullable();
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
      .integer('premises_type_id', 11)
      .unsigned()
      .references('premises_type_id')
      .inTable('rms_premises_types')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.string('premises_code', 20).notNullable();
    table.string('premises_manual_code', 20).nullable();
    table.string('premises_name', 200).notNullable();
    table.string('geo_location', 255).nullable();
    table.date('opening_date').notNullable();
    table.date('approval_date').nullable();
    table.text('address').nullable();
    table.decimal('total_premises_rent', 14, 2).notNullable().defaultTo(0);
    table.integer('status_flow_id', 11).notNullable();
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
  await knex.schema.hasTable('rms_premisess').then(async function (exists) {
    if (exists) {
      await knex.schema.alterTable('rms_premisess', (table) => {
        table.dropForeign('company_id');
        table.dropForeign('premises_type_id');
      });
      return knex.schema.dropTable('rms_premisess');
    }
  });
}
