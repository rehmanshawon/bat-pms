import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('config_vendor_banks', (table) => {
    table.increments('vendor_bank_id');
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
      .integer('bank_id', 11)
      .unsigned()
      .references('bank_id')
      .inTable('config_banks')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table
      .integer('vendor_id', 10)
      .unsigned()
      .references('vendor_id')
      .inTable('config_vendors')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .index();
    table
      .integer('branch_id', 10)
      .unsigned()
      .references('bank_branch_id')
      .inTable('config_bank_branchs')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .index();
    table.string('account_no', 50).notNullable().unique();
    table
      .string('account_type', 50)
      .notNullable()
      .comment('system config data');
    table.integer('created_by', 10).notNullable();
    table.integer('updated_by', 10).nullable();
    table.integer('deleted_by', 10).nullable();
    table.dateTime('created_at').notNullable().defaultTo(knex.fn.now());
    table.dateTime('updated_at').nullable();
    table.dateTime('deleted_at').nullable();
    table.specificType('status', 'smallint').defaultTo(1);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema
    .hasTable('config_vendor_banks')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable('config_vendor_banks', (table) => {
          table.dropForeign('company_id');
          table.dropForeign('bank_id');
          table.dropForeign('vendor_id');
          table.dropForeign('branch_id');
        });
        return knex.schema.dropTable('config_vendor_banks');
      }
    });
}
