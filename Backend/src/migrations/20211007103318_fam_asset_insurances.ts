import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('fam_asset_insurances', (table) => {
    table.increments('asset_insurance_id').notNullable();
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
    table.integer('insurance_memo_number', 11);
    table
      .integer('insurance_company_id', 11)
      .unsigned()
      .references('insurance_company_id')
      .inTable('fam_insurance_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.string('reference_number', 255).nullable();
    table.date('validity_date').nullable();
    table.decimal('file_path', 18, 2).nullable();
    table.text('comments').nullable();
    table.string('current_book_value', 255).nullable();
    table.date('last_depreciation_date').nullable();
    table.date('memo_date').nullable();
    table.string('insur_com_address', 255).nullable();
    table.date('insurance_date').nullable();
    table.string('premium', 255).nullable();
    table.string('policy_number', 255).nullable();
    table.integer('insurance_period', 11).nullable();
    table.string('insurance_type', 255).nullable();
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
    .hasTable('fam_asset_insurances')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable('fam_asset_insurances', (table) => {
          table.dropForeign('company_id');
          table.dropForeign('asset_id');
          table.dropForeign('insurance_company_id');
        });
        return knex.schema.dropTable('fam_asset_insurances');
      }
    });
}
