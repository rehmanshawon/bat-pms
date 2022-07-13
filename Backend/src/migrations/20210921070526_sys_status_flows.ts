import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('sys_status_flows', (table) => {
    table.increments('status_flow_id');
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
      .string('status_flow_slug', 100)
      .notNullable()
      .comment('unique status flow slug name');

    table
      .string('status_flows_name', 40)
      .notNullable()
      .comment('Must be within 40 char.');
    table.text('description').nullable();
    table
      .integer('parent_status_id', 10)
      .nullable()
      .comment('if Null That will be the parent status');
    //default data
    table.integer('created_by', 10).notNullable();
    table.integer('updated_by', 10).nullable();
    table.integer('deleted_by', 10).nullable();
    table.dateTime('created_at').notNullable();
    table.dateTime('updated_at').nullable();
    table.dateTime('deleted_at').nullable();
    table.specificType('status', 'smallint').defaultTo(1);

    //create composite unique index
    // table.index(
    //   ['status_flow_slug', 'company_id'],
    //   'sys_status_flow_company_id_unique_index',
    //   'UNIQUE',
    // );
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.hasTable('sys_status_flows').then(async function (exists) {
    if (exists) {
      await knex.schema.alterTable('sys_status_flows', (table) => {
        // table.dropIndex(
        //   ['status_flow_slug', 'company_id'],
        //   'sys_status_flow_company_id_unique_index',
        // );
        table.dropForeign('company_id');
      });
      return knex.schema.dropTable('sys_status_flows');
    }
  });
}
