import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('sc_reconciliations', (table) => {
    table.increments('reconciliation_id').notNullable();
    table
      .integer('company_id', 10)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.string('reconciliation_code', 20).notNullable();
    table
      .integer('reconciliation_branch_id', 11)
      .unsigned()
      .references('branch_id')
      .inTable('sys_branchs')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.date('reconciliation_date').notNullable();
    table
      .integer('reconciliation_wh_id', 11)
      .unsigned()
      .references('warehouse_id')
      .inTable('config_warehouses')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .index()
      .notNullable();
    table.text('purpose').nullable();
    table.text('remarks').nullable();
    table.specificType('reconciliation_status', 'smallint').notNullable();
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
    .hasTable('sc_reconciliations')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable('sc_reconciliations', (table) => {
          table.dropForeign('company_id');
          table.dropForeign('reconciliation_branch_id');
          table.dropForeign('warehouse_id');
        });
        return knex.schema.dropTable('sc_reconciliations');
      }
    });
}
