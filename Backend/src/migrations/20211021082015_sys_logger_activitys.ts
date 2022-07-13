import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('sys_logger_activitys', (table) => {
    table.increments('logger_activity_id').notNullable();
    table
      .integer('company_id', 11)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.string('logger_event', 100).notNullable().comment('login/failed');
    table.text('description').nullable();
    table.integer('user_id', 11).notNullable();
    table.string('user_type', 100).notNullable();
    table.string('route', 255).notNullable().comment('ip and url');
    table.string('ip_address', 100).notNullable();
    table.text('user_agent').notNullable();
    table.string('method_type', 20).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    table.datetime('log_out_time').nullable();
    table.enum('log_out_type', ['Force', 'Normal']).nullable();
    table.text('refresh_token').nullable();
    table.text('access_token', 'longtext').nullable();
    table.text('wrong_login_status', 'smallint').defaultTo(0).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema
    .hasTable('sys_logger_activitys')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable('sys_logger_activitys', (table) => {
          table.dropForeign('company_id');
        });
        return knex.schema.dropTable('sys_logger_activitys');
      }
    });
}
