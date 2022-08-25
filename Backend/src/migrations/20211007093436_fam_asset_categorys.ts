import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('fam_asset_categorys', (table) => {
    table.increments('asset_category_id').notNullable();
    table
      .integer('company_id', 11)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.string('asset_category_code', 20).unique().notNullable();
    table.string('asset_cateory_name', 100).unique().notNullable();
    table.text('description').nullable();
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
    .hasTable('fam_asset_categorys')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable('fam_asset_categorys', (table) => {
          table.dropForeign('company_id');
        });
        return knex.schema.dropTable('fam_asset_categorys');
      }
    });
}
