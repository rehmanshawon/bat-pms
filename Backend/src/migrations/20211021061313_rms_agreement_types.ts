import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('rms_agreement_types', (table) => {
    table.increments('agreement_type_id');
    table
      .integer('company_id', 11)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.string('agreement_type_name', 100).notNullable();
    table.integer('parent_agreement_type_id', 11).notNullable();
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
    .hasTable('rms_agreement_types')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable('rms_agreement_types', (table) => {
          table.dropForeign('company_id');
        });
        return knex.schema.dropTable('rms_agreement_types');
      }
    });
}
