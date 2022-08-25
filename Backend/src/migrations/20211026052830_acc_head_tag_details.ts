import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('acc_head_tag_details', (table) => {
    table.increments('head_tag_detail_id').notNullable();
    table
      .integer('company_id', 11)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table
      .bigInteger('account_code')
      .references('account_code')
      .inTable('acc_chart_of_accounts')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table
      .integer('tag_id', 11)
      .unsigned()
      .references('tag_id')
      .inTable('acc_tags')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
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
    .hasTable('acc_head_tag_details')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable('acc_head_tag_details', (table) => {
          table.dropForeign('company_id');
          table.dropForeign('account_code');
          table.dropForeign('tag_id');
        });
        return knex.schema.dropTable('acc_head_tag_details');
      }
    });
}
