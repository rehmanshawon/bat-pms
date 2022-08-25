import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('sys_modules', (table) => {
    table.increments('module_id');
    table.string('module_name', 100).notNullable();
    table.string('module_icon', 100).notNullable();
    table.string('module_lang', 100).nullable();
    table
      .string('module_url', 100)
      .notNullable()
      .comment('value only after base url. Should not use the full URL');
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
  await knex.schema.hasTable('sys_modules').then(function (exists) {
    if (exists) {
      return knex.schema.dropTable('sys_modules');
    }
  });
}
