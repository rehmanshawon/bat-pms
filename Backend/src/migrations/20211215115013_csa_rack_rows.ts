import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('csa_rack_rows', (table) => {
    table.increments('rack_row_id').notNullable();
    table
      .integer('rack_id', 11)
      .unsigned()
      .references('rack_id')
      .inTable('csa_racks')
      .notNullable()
      .index();
    table.integer('row_serial', 11).notNullable();
    table
      .integer('company_id', 10)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
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
  await knex.schema.hasTable('csa_rack_rows').then(async function (exists) {
    if (exists) {
      await knex.schema.alterTable('csa_rack_rows', (table) => {
        table.dropForeign('company_id');
        table.dropForeign('rack_id');
      });
      return knex.schema.dropTable('csa_rack_rows');
    }
  });
}
