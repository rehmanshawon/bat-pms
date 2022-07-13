import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('fam_insurance_companys', (table) => {
    table.increments('insurance_company_id').notNullable();
    table
      .integer('company_id', 11)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.string('insurance_company_name', 255).notNullable();
    table.string('license_no', 50).nullable();
    table.string('contact_no', 50).nullable();
    table.string('email', 100).nullable();
    table.text('company_detail').nullable();
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
    .hasTable('fam_insurance_companys')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable('fam_insurance_companys', (table) => {
          table.dropForeign('company_id');
        });
        return knex.schema.dropTable('fam_insurance_companys');
      }
    });
}
