import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('fam_auctions', (table) => {
    table.increments('auction_id').notNullable();
    table
      .integer('company_id', 11)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.string('auction_name', 255).nullable();
    table.string('auction_code', 20).nullable();
    table.enum('auction_type', ['Spot', 'Deliberate']).nullable();
    table.date('auction_date').nullable();
    table.enum('price_type', ['Individual', 'Excel', 'Bulk']).nullable();
    table
      .text('auction_remarks', 'longtext')
      .comment('User will write why exactly this purchase is necessary');
    table.string('memo_number', 20).nullable();
    table.date('memo_date').nullable();
    table.text('memo_details', 'longtext').nullable();
    table.string('buyer_name', 20).nullable();
    table.text('buyer_address').nullable();
    table.string('buyer_contact_no', 20).nullable();
    table.integer('auction_status', 11).nullable();
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
  await knex.schema.hasTable('fam_auctions').then(async function (exists) {
    if (exists) {
      await knex.schema.alterTable('fam_auctions', (table) => {
        table.dropForeign('company_id');
      });
      return knex.schema.dropTable('fam_auctions');
    }
  });
}
