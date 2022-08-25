import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('acc_coa_permissions', (table) => {
    table.increments('coa_permission_id').notNullable();
    table
      .integer('company_id', 10)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.integer('account_code', 11).notNullable();
    table.integer('user_id', 11).notNullable();
    table.integer('user_level_id', 11).notNullable().defaultTo(0);
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
    .hasTable('acc_coa_permissions')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable('acc_coa_permissions', (table) => {
          table.dropForeign('company_id');
        });
        return knex.schema.dropTable('acc_coa_permissions');
      }
    });
}
