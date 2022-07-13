import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('sys_features', (table) => {
    table.increments('feature_id');
    table.string('feature_name', 100).notNullable();
    table
      .string('feature_slug', 100)
      .notNullable()
      .comment('feature function name from controller');
    table.integer('parent_feature_id', 10).defaultTo(0).notNullable();
    table.integer('sort_number', 10).defaultTo(0).notNullable();
    table
      .integer('module_id', 10)
      .unsigned()
      .references('module_id')
      .inTable('sys_modules')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .index();
    //default value;
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
  await knex.schema.hasTable('sys_features').then(async function (exists) {
    if (exists) {
      await knex.schema.alterTable('sys_features', (table) => {
        table.dropForeign('module_id');
      });
      return knex.schema.dropTable('sys_features');
    }
  });
}
