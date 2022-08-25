import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('ten_tender_methods', (table) => {
    table.increments('tender_method_id').notNullable();
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
      .enum('tender_method_group', ['Open Tender', 'Close Tender'])
      .notNullable();
    table.string('tender_method_name', 100).notNullable();

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
  await knex.schema
    .hasTable('ten_tender_methods')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable('ten_tender_methods', (table) => {
          table.dropForeign('company_id');
        });
        return knex.schema.dropTable('ten_tender_methods');
      }
    });
}
