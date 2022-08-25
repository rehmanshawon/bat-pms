import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('sys_roles', (table) => {
    table.increments('role_id');
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
    table.string('role_name', 50).notNullable();
    table.text('description').nullable();
    table
      .integer('min_username_length', 2)
      .notNullable()
      .comment('default 8 char username ');
    table
      .integer('max_username_length', 2)
      .notNullable()
      .comment('maximum allowed char in the username');
    table
      .specificType('multi_login_allow', 'smallint')
      .notNullable()
      .comment('default not allow');
    table
      .integer('max_wrong_login_attemp', 2)
      .notNullable()
      .comment(
        'action perform after 3 time wrong password. 0 for unlimited try',
      );
    table
      .enum('wrong_login_attemp', [
        'No Restriction',
        'Blocked',
        'Block for a Period',
      ])
      .notNullable()
      .defaultTo('No Restriction');
    table
      .integer('block_period', 4)
      .notNullable()
      .defaultTo(5)
      .comment(
        'minute number for login block if wrong login attempt is blocked for a period',
      );
    table
      .integer('session_time_out', 4)
      .notNullable()
      .defaultTo(30)
      .comment(
        '30 min is the default time. input must be in minuite. For unlimited session please input 0',
      );
    table.string('password_regex', 255).notNullable();
    table.string('password_regex_error_msg', 255).notNullable();
    table
      .integer('password_expiry_notify', 3)
      .notNullable()
      .defaultTo(15)
      .comment('How many days earlier notify will activated.');
    table
      .integer('password_expiry_duration', 30)
      .notNullable()
      .defaultTo(90)
      .comment(
        '90 days is the default. input must be in day. Use 0 for unlimited validity',
      );
    table
      .enum('password_expiry_action', ['Notify', 'Force'])
      .notNullable()
      .defaultTo('Notify');
    //default field
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
  await knex.schema.hasTable('sys_roles').then(async function (exists) {
    if (exists) {
      await knex.schema.alterTable('sys_roles', (table) => {
        table.dropForeign('company_id');
        table.dropForeign('module_id');
      });
      return knex.schema.dropTable('sys_roles');
    }
  });
}
