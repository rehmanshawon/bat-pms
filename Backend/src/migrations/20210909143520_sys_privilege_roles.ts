import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('sys_privilege_roles', (table) => {
    table
      .integer('role_id', 10)
      .unsigned()
      .references('role_id')
      .inTable('sys_roles')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .index();
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
      .integer('user_id', 10)
      .unsigned()
      .references('user_id')
      .inTable('sys_users')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .index();
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
    .hasTable('sys_privilege_roles')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable('sys_privilege_roles', (table) => {
          table.dropForeign('role_id');
          table.dropForeign('company_id');
          table.dropForeign('user_id');
        });
        return knex.schema.dropTable('sys_privilege_roles');
      }
    });
}
