import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('ten_evaluation_marks', (table) => {
    table.increments('evaluation_base_mark_id').notNullable();
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
    table.integer('ref_id', 11).notNullable().comment('product/component id');
    table.decimal('base_marks', 10, 2).notNullable();
    table.text('evaluate_criteria').notNullable();
    table
      .integer('vendor_id', 11)
      .unsigned()
      .references('vendor_id')
      .inTable('config_vendors')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .nullable()
      .index();
    table.decimal('vendor_achievement', 10, 2).nullable();
    table.text('evaluator_remarks').nullable();

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
        await knex.schema.alterTable('ten_evaluation_marks', (table) => {
          table.dropForeign('company_id');
          table.dropForeign('tender_id');
          table.dropForeign('vendor_id');
        });
        return knex.schema.dropTable('ten_evaluation_marks');
      }
    });
}
