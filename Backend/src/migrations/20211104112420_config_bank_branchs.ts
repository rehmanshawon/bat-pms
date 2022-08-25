import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('config_bank_branchs', (table) => {
    table.increments('bank_branch_id');
    table
      .integer('company_id', 10)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table
      .integer('bank_id', 11)
      .unsigned()
      .references('bank_id')
      .inTable('config_banks')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.string('branch_name', 100).notNullable();
    table.text('branch_address').nullable();
    table.integer('created_by', 10).notNullable();
    table.integer('updated_by', 10).nullable();
    table.integer('deleted_by', 10).nullable();
    table.dateTime('created_at').notNullable().defaultTo(knex.fn.now());
    table.dateTime('updated_at').nullable();
    table.dateTime('deleted_at').nullable();
    table.specificType('status', 'smallint').defaultTo(1);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema
    .hasTable('config_bank_branchs')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable('config_bank_branchs', (table) => {
          table.dropForeign('company_id');
          table.dropForeign('bank_id');
        });
        return knex.schema.dropTable('config_bank_branchs');
      }
    });
}
