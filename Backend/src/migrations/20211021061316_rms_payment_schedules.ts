import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('rms_payment_schedules', (table) => {
    table.increments('payment_schedule_id');
    table
      .integer('company_id', 11)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.string('payment_schedule_code', 100).notNullable();
    table.string('rental_month', 100).notNullable();
    table.decimal('total_rent', 18, 6).notNullable();
    table.decimal('bill_amout', 18, 6).notNullable();
    table.decimal('due_amount', 18, 6).notNullable();
    table.enum('schedule_type', ['regular', 'hold']).notNullable();
    table.integer('status_flow_id', 11).notNullable();
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
    .hasTable('rms_payment_schedules')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable('rms_payment_schedules', (table) => {
          table.dropForeign('company_id');
        });
        return knex.schema.dropTable('rms_payment_schedules');
      }
    });
}
