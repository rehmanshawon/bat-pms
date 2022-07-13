import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('sys_user_tokens', (table) => {
    table.increments('user_token_id').notNullable();
    table
      .integer('company_id', 11)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.integer('user_id', 11).notNullable();
    table.string('refresh_token', 255).notNullable();
    table.date('refresh_token_expiry_date').notNullable();
    table.text('access_token').notNullable();
    table.string('ip_address', 100).notNullable();
    table.dateTime('created_at').notNullable().defaultTo(knex.fn.now());
    table.specificType('status', 'smallint').defaultTo(1).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.hasTable('sys_user_tokens').then(async function (exists) {
    if (exists) {
      await knex.schema.alterTable('sys_user_tokens', (table) => {
        table.dropForeign('company_id');
      });
      return knex.schema.dropTable('sys_user_tokens');
    }
  });
}
