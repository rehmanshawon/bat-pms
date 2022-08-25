import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('fam_asset_depreciation_logs', (table) => {
    table.increments('asset_depreciation_log_id').notNullable();
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
      .integer('asset_id', 11)
      .unsigned()
      .references('asset_id')
      .inTable('fam_assets')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table
      .integer('asset_depreciation_id', 11)
      .unsigned()
      .references('asset_depreciation_id')
      .inTable('fam_asset_depreciations')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .index();
    table
      .integer('depreciation_method_id', 11)
      .unsigned()
      .references('depreciation_method_id')
      .inTable('fam_depreciation_methods')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .index();
    table.integer('useful_life_year', 4).nullable();
    table.decimal('current_value', 18, 2).nullable();
    table.decimal('previous_value', 18, 2).nullable();
    table.decimal('depreciated_amount', 18, 2).nullable();
    table.specificType('remaining_useful_life', 'smallint').nullable();
    table.decimal(' applicable_rate', 18, 2).nullable();
    table.string('depreciation_month', 255).nullable();
    table.text('depreciation_remarks').nullable();
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
    .hasTable('fam_asset_depreciation_logs')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable('fam_asset_depreciation_logs', (table) => {
          table.dropForeign('company_id');
          table.dropForeign('asset_id');
          table.dropForeign('asset_depreciation_id');
          table.dropForeign('depreciation_method_id');
        });
        return knex.schema.dropTable('fam_asset_depreciation_logs');
      }
    });
}
