import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('rms_owners_infos', (table) => {
    table.increments('owners_info_id');
    table
      .integer('company_id', 11)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.string('owners_name', 255).notNullable();
    table.string('mobile', 15).notNullable();
    table.string('email', 150).notNullable();
    table.string('present_address', 255).nullable();
    table.string('permanent_address', 255).nullable();
    table.string('bank_name', 100).nullable();
    table.string('branch_name', 100).nullable();
    table.string('account_no', 100).nullable();
    table.string('account_type', 100).nullable();
    //default Coumn
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
  await knex.schema.hasTable('rms_owners_infos').then(async function (exists) {
    if (exists) {
      await knex.schema.alterTable('rms_owners_infos', (table) => {
        table.dropForeign('company_id');
      });
      return knex.schema.dropTable('rms_owners_infos');
    }
  });
}
