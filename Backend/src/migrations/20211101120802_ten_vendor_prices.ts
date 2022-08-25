import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('ten_vendor_prices', (table) => {
    table.increments('vendor_price_id').notNullable();
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
      .integer('tender_id', 11)
      .unsigned()
      .references('tender_id')
      .inTable('ten_tenders')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table
      .integer('tender_participant_id')
      .unsigned()
      .references('tender_participant_id')
      .inTable('ten_tender_participants')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.enum('price_for', ['Item', 'Component']).notNullable();
    table.string('price_ref', 50).notNullable().comment('item id/component id');
    table.decimal('capable_qty', 18, 5).notNullable();
    table.string('trans_uom', 20).notNullable();
    table.decimal('price_amount', 18, 2).notNullable();

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
  await knex.schema
    .hasTable('ten_evaluation_marks')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable('ten_vendor_prices', (table) => {
          table.dropForeign('company_id');
          table.dropForeign('tender_id');
          table.dropForeign('tender_participant_id');
        });
        return knex.schema.dropTable('ten_vendor_prices');
      }
    });
}
