import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('rms_spcial_addition_deductions', (table) => {
    table.increments('sadd_id').notNullable();
    table
      .integer('company_id', 11)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT').notNullable;
    table
      .integer('premises_id', 11)
      .unsigned()
      .references('premises_id')
      .inTable('rms_premisess')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table
      .integer('agreement_id', 11)
      .unsigned()
      .references('agreement_id')
      .inTable('rms_agreements')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.string('sad_code', 100).notNullable();
    table.enum('case_type', ['Addition', 'Deduction']).notNullable();
    table.integer('rules', 11).notNullable();
    table.decimal('special_amount', 18, 6).notNullable();
    table.integer('adjustment_rule', 11).notNullable();
    table.integer('adjust_in', 11).notNullable();
    table.decimal('adjustment_amount', 18, 6).notNullable();
    table.decimal('ratio_of_rent', 18, 6).nullable();
    table.string('adjustment_start', 7).notNullable();
    table.text('remarks').notNullable();
    table.integer('status_flow_id', 11).notNullable();
    table.string('delegation_for', 50).nullable();
    table.string('delegation_ref_event_id', 50).nullable();
    table.integer('delegation_version', 11).nullable();
    table.integer('delegation_step', 11).nullable();
    table.integer('delegation_person', 11).nullable();
    table.integer('delegation_reliever_id', 11).nullable();
    table.integer('delegation_decline_count', 11).nullable();
    table.dateTime('delegation_final_approved').nullable();
    table.enum('delegation_type', ['Auto', 'Manual']).notNullable();
    table.dateTime('delegation_initialized').nullable();
    table.text('delegation_manual_user').nullable();
    table.specificType('is_manual', 'smallint').nullable();
    table.integer('count_schedule', 11).nullable();
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
    .hasTable('rms_spcial_addition_deductions')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable(
          'rms_spcial_addition_deductions',
          (table) => {
            table.dropForeign('company_id');
            table.dropForeign('premises_id');
            table.dropForeign('agreement_id');
          },
        );
        return knex.schema.dropTable('rms_spcial_addition_deductions');
      }
    });
}
