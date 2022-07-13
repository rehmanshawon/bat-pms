import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('acc_autovoucher_tags', (table) => {
    table.increments('autovoucher_tag_id').notNullable();
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
      .integer('autovoucher_id', 10)
      .unsigned()
      .references('autovoucher_id')
      .inTable('acc_autovouchers')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table
      .integer('tag_id', 10)
      .unsigned()
      .references('tag_id')
      .inTable('acc_tags')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.text('sql').notNullable();
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
  await knex.schema
    .hasTable('acc_autovoucher_tags')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable('acc_autovoucher_tags', (table) => {
          table.dropForeign('company_id');
          table.dropForeign('autovoucher_id');
          table.dropForeign('tag_id');
        });
        return knex.schema.dropTable('acc_autovoucher_tags');
      }
    });
}
