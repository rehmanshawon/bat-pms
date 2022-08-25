import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('fam_auction_assets', (table) => {
    table.increments('asset_auction_id').notNullable();
    table
      .integer('company_id', 11)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.enum('auction_type', ['Spot', 'Deliberate']).notNullable();
    table
      .integer('auction_id', 11)
      .unsigned()
      .references('auction_id')
      .inTable('fam_auctions')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .nullable()
      .index();
    table.integer('asset_id').nullable();
    table.integer('requested_by', 10).nullable();
    table.text('auction_reason', 'longtext').nullable();
    table.decimal('auction_price', 18, 2).nullable();
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
    .hasTable('fam_auction_assets')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable('fam_auction_assets', (table) => {
          table.dropForeign('company_id');
          table.dropForeign('auction_id');
        });
        return knex.schema.dropTable('fam_auction_assets');
      }
    });
}
