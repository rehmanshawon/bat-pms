import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('ten_tender_participants', (table) => {
    table.increments('tender_participant_id').notNullable();
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
      .integer('vendor_id', 11)
      .unsigned()
      .references('vendor_id')
      .inTable('config_vendors')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .nullable()
      .index();
    table.date('application_date').notNullable();
    table.decimal('tender_paid_amount', 10, 2).nullable();
    table.string('paid_by', 50).nullable();
    table.string('payment_ref', 50).nullable();

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
        await knex.schema.alterTable('ten_tender_participants', (table) => {
          table.dropForeign('company_id');
          table.dropForeign('tender_id');
          table.dropForeign('vendor_id');
        });
        return knex.schema.dropTable('ten_tender_participants');
      }
    });
}
