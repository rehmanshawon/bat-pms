import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('fam_asset_depreciations', (table) => {
    table.increments('asset_depreciation_id').notNullable();
    table
      .integer('company_id', 11)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.integer('asset_id', 11).notNullable();
    table
      .integer('depreciation_method_id', 11)
      .unsigned()
      .references('depreciation_method_id')
      .inTable('fam_depreciation_methods')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .index();
    table.date('effective_date').nullable();
    table.integer('useful_life', 11).nullable();
    table.integer('remaining_life', 11).nullable();
    table.decimal('salvage_value', 18, 2).nullable();
    table.decimal('depreciation_rate', 18, 2).nullable();
    table.decimal('purchase_price', 18, 2).nullable();
    table.decimal('depreciated_amount', 18, 2).nullable();
    table.decimal('current_book_value', 18, 2).nullable();
    table.date('last_depreciation_date').nullable();
    table.string('straight_line_type', 255).nullable();
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
    .hasTable('fam_asset_depreciations')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable('fam_asset_depreciations', (table) => {
          table.dropForeign('company_id');
          table.dropForeign('depreciation_method_id');
        });
        return knex.schema.dropTable('fam_asset_depreciations');
      }
    });
}
