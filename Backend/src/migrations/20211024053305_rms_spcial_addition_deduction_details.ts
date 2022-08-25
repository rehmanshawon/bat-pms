import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    'rms_spcial_addition_deduction_details',
    (table) => {
      table.increments('spcial_addition_deduction_detail_id');
      table
        .integer('company_id', 11)
        .unsigned()
        .references('company_id')
        .inTable('sys_companys')
        .onDelete('RESTRICT')
        .onUpdate('RESTRICT')
        .notNullable();
      table
        .integer('sadd_id', 11)
        .unsigned()
        .references('sadd_id')
        .inTable('rms_spcial_addition_deductions')
        .onDelete('RESTRICT')
        .onUpdate('RESTRICT')
        .notNullable();
      table.integer('collector_id').notNullable();
      table.string('month', 7).notNullable();
      table.decimal('amount', 18, 6).notNullable();
      //default Coumn
      table.integer('created_by', 10).notNullable();
      table.integer('updated_by', 10).nullable();
      table.integer('deleted_by', 10).nullable();
      table.dateTime('created_at').notNullable();
      table.dateTime('updated_at').nullable();
      table.dateTime('deleted_at').nullable();
      table.specificType('status', 'smallint').defaultTo(1);
    },
  );
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema
    .hasTable('rms_spcial_addition_deduction_details')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable(
          'rms_spcial_addition_deduction_details',
          (table) => {
            table.dropForeign('company_id');
            table.dropForeign('sadd_id');
          },
        );
        return knex.schema.dropTable('rms_spcial_addition_deduction_details');
      }
    });
}
