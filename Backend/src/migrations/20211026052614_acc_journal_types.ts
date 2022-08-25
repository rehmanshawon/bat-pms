import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('acc_journal_types', (table) => {
    table.increments('journal_type_id').notNullable();
    table
      .integer('company_id', 10)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.string('journal_type_name', 150).notNullable();
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
  await knex.schema.hasTable('acc_journal_types').then(async function (exists) {
    if (exists) {
      await knex.schema.alterTable('acc_journal_types', (table) => {
        table.dropForeign('company_id');
      });
      return knex.schema.dropTable('acc_journal_types');
    }
  });
}
