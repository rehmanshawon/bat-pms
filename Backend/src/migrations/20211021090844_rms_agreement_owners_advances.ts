import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('rms_agreement_owners_advances', (table) => {
    table.increments('agreement_owners_advance_id').notNullable();
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
      .integer('agreement_owners_info_id', 11)
      .unsigned()
      .references('agreement_owners_info_id')
      .inTable('rms_agreement_owners_infos')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.enum('advance_type', ['Primary', 'Secondary']).notNullable();
    table.integer('advance_amount', 11).nullable();
    table.enum('adjustment_rules', ['ratio', 'fixed']).nullable();
    table.integer('ratio_value', 11).nullable();
    table.integer('adjustment_amount', 11).nullable();
    table.date('advance_date').nullable();
    table.string('adjustment_from_month', 7).nullable();
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
    .hasTable('rms_agreement_owners_advances')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable(
          'rms_agreement_owners_advances',
          (table) => {
            table.dropForeign('company_id');
            table.dropForeign('agreement_owners_info_id');
          },
        );
        return knex.schema.dropTable('rms_agreement_owners_advances');
      }
    });
}
