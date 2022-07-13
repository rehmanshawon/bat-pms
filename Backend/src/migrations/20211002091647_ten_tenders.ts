import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('ten_tenders', (table) => {
    table.increments('tender_id').notNullable();
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
      .string('tender_code', 50)
      .unique()
      .notNullable()
      .comment('unique id logic generated code');
    table.integer('tender_method_id', 11).notNullable();
    table.string('tender_method_group', 100).notNullable();
    table.string('tender_name').notNullable();
    table.enum('evaluate_type', ['Tender', 'Item', 'Component']).notNullable();
    table.text('tender_details').nullable();
    table.decimal('tender_signing_price', 10, 2).nullable();
    table.dateTime('sell_start_date').notNullable();
    table.dateTime('sell_end_date').notNullable();
    table.date('pre_bid_meeting_date').nullable();
    table.date('opening_tech_offer_date').notNullable();
    table.date('opening_fin_offer_date').notNullable();
    table.date('publish_date').nullable();
    table.dateTime('tender_drop_end_date').notNullable();
    table.integer('tender_status', 10).notNullable().defaultTo(0);

    //default data
    table.integer('created_by', 10).notNullable();
    table.integer('updated_by', 10).nullable();
    table.integer('deleted_by', 10).nullable();
    table.dateTime('created_at').defaultTo(knex.fn.now()).notNullable();
    table.dateTime('updated_at').nullable();
    table.dateTime('deleted_at').nullable();
    table.specificType('status', 'smallint').defaultTo(1);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.hasTable('ten_tenders').then(async function (exists) {
    if (exists) {
      await knex.schema.alterTable('ten_tenders', (table) => {
        table.dropForeign('company_id');
      });
      return knex.schema.dropTable('ten_tenders');
    }
  });
}
