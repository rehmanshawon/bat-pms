import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('sys_delegation_conf', (table) => {
    table.increments('delegation_conf_id');
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
      .string('delegation_for', 50)
      .notNullable()
      .comment(
        'for which module or purpose. could be for Purchase or Requistion or sales or anything define by the stackholder. and always select one field in select query.',
      );
    table
      .string('ref_event_id', 20)
      .notNullable()
      .comment(
        'the value of session variable. relation with db table sys_unique_id_logic.session_variable',
      );
    table.string('delegation_version', 100).notNullable();
    table
      .enum('manage_by', ['Hierarchy', 'Sorting', 'Limit', 'Designation'])
      .defaultTo('Hierarchy')
      .notNullable();
    table.integer('user_id', 10).nullable();
    table
      .integer('max_limit', 10)
      .nullable()
      .comment('the amount of the limit.');
    table
      .enum('limit_type', ['Maximum', 'Above'])
      .defaultTo('Maximum')
      .nullable();
    table.integer('sort_number', 2).nullable();
    table
      .specificType('same_sort', 'smallint')
      .notNullable()
      .comment(
        'use for when configuration is sorting and same sort 0=not same sort 1=same sort',
      );
    table.integer('step_number', 2).nullable();
    table.specificType('must_approve', 'smallint').nullable();
    table
      .enum('approve_priority', ['Majority', 'Minority', 'All'])
      .defaultTo('All')
      .nullable()
      .comment(
        'Majority = if maximum people approve; Minority = at least one person approve, All = everyone must approve',
      );
    table
      .string('step_name', 50)
      .nullable()
      .comment('Optional if user like to define any name.');
    table
      .enum('decline_logic', ['Previous Approval', 'Initiator'])
      .defaultTo('Initiator')
      .nullable();
    table
      .integer('designation_id', 10)
      .nullable()
      .comment(
        'if manage_by=Designation then this column fire otherwise this coloumn does not work',
      );
    table.string('termination_trigger', 50).nullable();
    table
      .text('session_variable')
      .nullable()
      .comment(
        'Must be a sql to find the termination trigger value. and its dynamic variable always @delegation_person_id which will be replace by current delegation person id',
      );
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
    .hasTable('sys_delegation_conf')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable('sys_delegation_conf', (table) => {
          table.dropForeign('company_id');
        });
        return knex.schema.dropTable('sys_delegation_conf');
      }
    });
}
