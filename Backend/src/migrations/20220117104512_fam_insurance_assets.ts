import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('fam_insurance_assets', (table) => {
    table.increments('insurance_asset_id').notNullable();
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
      .integer('insurance_id', 11)
      .unsigned()
      .references('insurance_id')
      .inTable('fam_insurances')
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
    table.decimal('current_book_value', 18, 2).notNullable();
    table.integer('remaining_life_time', 11).nullable();
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
    .hasTable('fam_insurance_assets')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable('fam_insurance_assets', (table) => {
          table.dropForeign('company_id');
          table.dropForeign('insurance_id');
          table.dropForeign('asset_id');
        });
        return knex.schema.dropTable('fam_insurance_assets');
      }
    });
}
