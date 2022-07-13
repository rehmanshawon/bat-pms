import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('fam_insurances', (table) => {
    table.increments('insurance_id').notNullable();
    table
      .integer('company_id', 11)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.string('insurance_code', 20).notNullable();
    table.integer('insurance_memo_number', 11).nullable();
    table
      .integer('insurance_company_id', 11)
      .unsigned()
      .references('vendor_id')
      .inTable('config_vendors')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.string('reference_number', 255).nullable();
    table.date('start_date').nullable();
    table.date('expiry_date').nullable();
    table.text('remarks').nullable();
    table.date('insurance_date').nullable();
    table.decimal('premium', 18, 2).nullable();
    table.text('insurance_policy').nullable();
    table.string('insurance_type', 255).nullable();
    table.specificType('insurance_status', 'smallint').notNullable();
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
  await knex.schema.hasTable('fam_insurances').then(async function (exists) {
    if (exists) {
      await knex.schema.alterTable('fam_insurances', (table) => {
        table.dropForeign('company_id');
        table.dropForeign('insurance_company_id');
      });
      return knex.schema.dropTable('fam_insurances');
    }
  });
}
