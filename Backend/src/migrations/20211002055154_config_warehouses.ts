import { Knex } from 'knex';
//name change sc_warehouse to config_warehouses
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('config_warehouses', (table) => {
    table.increments('warehouse_id').notNullable();
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
      .integer('branch_id', 11)
      .unsigned()
      .references('branch_id')
      .inTable('sys_branchs')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.string('warehouse_code', 20).unique().notNullable();
    table.string('warehouse_name', 255).notNullable();
    table.enum('is_plant', ['Yes', 'No']).notNullable();
    table.text('address').nullable();
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
  await knex.schema.hasTable('config_warehouses').then(async function (exists) {
    if (exists) {
      await knex.schema.alterTable('config_warehouses', (table) => {
        table.dropForeign('company_id');
        table.dropForeign('branch_id');
      });
      return knex.schema.dropTable('config_warehouses');
    }
  });
}
