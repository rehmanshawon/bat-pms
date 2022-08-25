import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('pms_bill_details', (table) => {
    table.increments('bill_details_id').notNullable();
    table
      .integer('bill_id', 11)
      .unsigned()
      .references('bill_id')
      .inTable('pms_bills')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.float('ordered_quantity', 10, 2).notNullable();
    table.float('received_quantity', 10, 2).notNullable();
    table.float('unit_price', 10, 2).notNullable();
    table.float('vat_percentage', 10, 2);
    table.decimal('vat_amount', 15, 2);
    table.float('tax_percentage', 10, 2);
    table.decimal('tax_amount', 15, 2);
    table.decimal('total_price', 15, 2).notNullable();
    table
      .integer('product_id', 11)
      .unsigned()
      .references('product_id')
      .inTable('config_products')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    // table
    //   .integer('project_id', 11)
    //   .unsigned()
    //   .references('project_id')
    //   .inTable('pms_projects')
    //   .onDelete('RESTRICT')
    //   .onUpdate('RESTRICT')
    //   .index();
    table.string('reference_type', 20).notNullable();
    table.integer('reference_id', 11).notNullable();
    table.date('bill_date');
    table.date('process_date');
    table.string('bulk_type', 150);
    table.string('location', 150);
    table.text('description');
    table.string('bill_number', 20);
    table.string('favouring', 150);
    table.string('remarks', 150);
    table.decimal('bill_amount', 15, 2);
    table.string('ticket_number', 20);
    table.decimal('net_paid_amount', 15, 2);
    table.decimal('deduction_amount', 15, 2);
    table.float('deduction_percentage', 10, 2);
    table.decimal('advance_adjusted_amount', 15, 2);
    table.float('advance_adjusted_percentage', 10, 2);
    table.string('reference_object_type', 20);
    table.integer('reference_object_id', 11);
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
  await knex.schema.hasTable('pms_bill_details').then(async function (exists) {
    if (exists) {
      await knex.schema.alterTable('pms_bill_details', (table) => {
        table.dropForeign('bill_id');
        table.dropForeign('product_id');
        // table.dropForeign('project_id');
      });
      return knex.schema.dropTable('pms_bill_details');
    }
  });
}
