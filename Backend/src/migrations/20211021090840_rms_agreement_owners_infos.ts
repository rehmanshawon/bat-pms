import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('rms_agreement_owners_infos', (table) => {
    table.increments('agreement_owners_info_id');
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
      .integer('premises_id')
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
    table
      .integer('owners_info_id', 11)
      .unsigned()
      .references('owners_info_id')
      .inTable('rms_owners_infos')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table
      .enum('owners_type', ['owner', 'collector'])
      .notNullable()
      .defaultTo('owner');
    table.specificType('pay_to', 'smallint').notNullable().defaultTo(0);
    table.string('floor', 50).nullable();
    table.string('owners_name', 150).notNullable();
    table.string('owners_mobile', 15).notNullable();
    table.string('permanent_address', 255).nullable();
    table.string('present_address', 255).nullable();
    table.string('email', 100).nullable();
    table.decimal('area_owned', 10, 2).nullable();
    table.integer('total_amount', 11).notNullable().defaultTo(0);
    table.integer('advance_amount', 11).notNullable().defaultTo(0);
    table.string('payment_method', 100).notNullable();
    table.string('payment_ratio', 100).nullable();
    table.string('bank_name', 200).nullable();
    table.string('branch_name', 100).nullable();
    table.string('account_no', 100).nullable();
    table.string('account_type', 100).nullable();
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
    .hasTable('rms_agreement_owners_infos')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable('rms_agreement_owners_infos', (table) => {
          table.dropForeign('company_id');
          table.dropForeign('premises_id');
          table.dropForeign('agreement_id');
          table.dropForeign('owners_info_id');
        });
        return knex.schema.dropTable('rms_agreement_owners_infos');
      }
    });
}
