import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('sys_unique_id_logics', (table) => {
    table.increments('unique_id_logic_id');
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
      .string('id_for', 50)
      .unique()
      .notNullable()
      .comment('A unique name why system need id?');
    table
      .string('slug', 10)
      .unique()
      .notNullable()
      .comment('Unique identifier name');
    table
      .integer('id_length', 11)
      .defaultTo(6)
      .notNullable()
      .comment('default 6 digit ID');
    table
      .string('id_format', 100)
      .notNullable()
      .comment('unique id generation format');
    table
      .string('token_reset_logic', 100)
      .notNullable()
      .comment(
        'YY=1,MM=0.BR=1, if 1 then id sequence will be start from begining for that change',
      );
    table
      .integer('starting_id', 11)
      .defaultTo(1)
      .notNullable()
      .comment('Default startting id for unique id logic(Default 1)');
    table
      .string('delegation_trigger', 50)
      .defaultTo('SQL')
      .notNullable()
      .comment(
        'any thing define by the user. could be department or designation or location',
      );

    table
      .enum('delegation_type_enum', ['MC', 'WF', 'DLM'])
      .notNullable()
      .defaultTo('WF');
    table.string('session_variable', 50).nullable();
    table.text('trigger_sql').nullable();
    table.text('ref_event_slug').nullable();
    table
      .string('delegation_version', 100)
      .defaultTo(1)
      .notNullable()
      .comment(
        'current version should update every time while new process flow define',
      );
    table
      .string('operation_function', 100)
      .nullable()
      .comment(
        'the name of function (placed in delegationHelper) where the status change occure additional operation during the final approval or status change',
      );
    table
      .integer('draft_status', 11)
      .notNullable()
      .comment('an id from sys_status_flow table');
    table
      .integer('after_approve_status', 11)
      .notNullable()
      .comment('an id from sys_status_flow table');
    table
      .integer('initiate_approve_status', 11)
      .notNullable()
      .comment('an id from sys_status_flow table');
    table
      .integer('after_decline_status', 11)
      .notNullable()
      .comment('an id from sys_status_flow table');
    table
      .string('ref_db_table_name', 100)
      .notNullable()
      .comment(
        'database table name where the delegation information has to update',
      );
    table
      .string('ref_id_field', 100)
      .notNullable()
      .comment(
        'could be primary key field name or the unique key field name of the referance db table',
      );
    table
      .string('ref_status_field', 100)
      .notNullable()
      .comment('referance db table delegation status field');
    table.text('sql_calc_amount').nullable();
    table
      .string('function_delegation_initialize')
      .nullable()
      .comment('a custom function when delegation start first time');
    table
      .string('function_delegation_approved')
      .nullable()
      .comment('a custom function when delegation completed or final approved');
    table
      .string('function_delegation_declined')
      .nullable()
      .comment('a custom function when delegation decline to draft status');
    table.integer('status', 1);
    //create composite unique index
    // table.index(
    //   ['slug', 'company_id'],
    //   'sys_unique_id_slug_company_id_unique_index',
    //   'UNIQUE',
    // );
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema
    .hasTable('sys_unique_id_logics')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable('sys_unique_id_logics', (table) => {
          // table.dropIndex(
          //   ['slug', 'company_id'],
          //   'sys_unique_id_slug_company_id_unique_index',
          // );
          table.dropForeign('company_id');
        });
        return knex.schema.dropTable('sys_unique_id_logics');
      }
    });
}
