import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('sys_action_buttons', (table) => {
    table.increments('action_btn_id');
    table
      .integer('company_id', 10)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.string('btn_name', 50).notNullable();
    table
      .enum('btn_type', ['button', 'link'])
      .defaultTo('button')
      .notNullable();
    table.string('route_link', 255).nullable();
    table.string('btn_class', 255).nullable();
    table.string('btn_id', 20).nullable();
    table.string('btn_order', 20).nullable();
    table.string('btn_icon', 20).nullable();
    table.string('btn_data_attr', 255).nullable();
    table.string('dependency_attr', 255).nullable();
    table.string('dependency_attr_value', 255).nullable();
    table.string('btn_slug', 255).nullable();
    table.string('grid_slug', 50).nullable();
    table.specificType('in_dropdown', 'smallint').defaultTo(0);
    table.specificType('always_show', 'smallint').defaultTo(0);
    table.string('enable_status', 50).nullable();
    table.string('disable_status', 50).nullable();
    table.specificType('enable_multiple', 'smallint');
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
    .hasTable('sys_action_buttons')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable('sys_action_buttons', (table) => {
          table.dropForeign('company_id');
        });
        return knex.schema.dropTable('sys_action_buttons');
      }
    });
}
