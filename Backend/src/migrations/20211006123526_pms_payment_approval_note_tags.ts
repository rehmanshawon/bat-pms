import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('pms_payment_approval_note_tags', (table) => {
    table.increments('payment_approval_note_tag_id').notNullable();
    table
      .integer('payment_approval_note_id', 11)
      .unsigned()
      .references('payment_approval_note_id')
      .inTable('pms_payment_approval_notes')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table
      .integer('branch_id', 11)
      .unsigned()
      .references('branch_id')
      .inTable('sys_branchs')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.string('voucher_no', 50).notNullable();
    table.date('voucher_date').notNullable();
    table.integer('sl_no', 11).notNullable();
    table
      .bigInteger('gl_code')
      .references('account_code')
      .inTable('acc_chart_of_accounts')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.decimal('debit', 15, 8).defaultTo(0).notNullable();
    table.decimal('credit', 15, 8).defaultTo(0).notNullable();
    table
      .integer('bill_id', 11)
      .unsigned()
      .references('bill_id')
      .inTable('pms_bills')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table
      .integer('product_id', 11)
      .unsigned()
      .references('product_id')
      .inTable('config_products')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .index();
    table
      .integer('company_id', 11)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();

    //default data
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
    .hasTable('pms_payment_approval_note_tags')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable(
          'pms_payment_approval_note_tags',
          (table) => {
            table.dropForeign('company_id');
            table.dropForeign('payment_approval_note_id');
            table.dropForeign('gl_code');
            table.dropForeign('branch_id');
            table.dropForeign('bill_id');
            table.dropForeign('product_id');
          },
        );
        return knex.schema.dropTable('pms_payment_approval_note_tags');
      }
    });
}
