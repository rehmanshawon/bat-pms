import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('attach_types', (table) => {
    table.increments('attach_type_id');
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
      .integer('module_id', 10)
      .unsigned()
      .references('module_id')
      .inTable('sys_modules')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .index();
    table
      .string('attach_config_slug', 20)
      .references('attach_config_slug')
      .inTable('attach_configs')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .index();
    table.string('attach_type_name', 100).notNullable();

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
  await knex.schema.hasTable('attach_types').then(async function (exists) {
    if (exists) {
      //drop foreign keys before dropping table
      await knex.schema.alterTable('attach_types', (table) => {
        table.dropForeign('company_id');
        table.dropForeign('module_id');
        table.dropForeign('attach_config_slug');
      });

      return knex.schema.dropTable('attach_types');
    }
  });
}
