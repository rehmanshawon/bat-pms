import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('fam_insurance_claims', (table) => {
    table.increments('insurance_claim_id').notNullable();
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
      .integer('insurance_company_id', 11)
      .unsigned()
      .references('insurance_company_id')
      .inTable('fam_insurance_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .nullable()
      .index();
    table.string('insurance_claim_code', 20).nullable();
    table
      .integer('maint_request_id', 11)
      .unsigned()
      .references('maint_request_id')
      .inTable('fam_maint_requests')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .nullable()
      .index();
    table
      .integer('asset_id', 11)
      .unsigned()
      .references('asset_id')
      .inTable('fam_assets')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .nullable()
      .index();
    table
      .date('claim_date')
      .nullable()
      .comment('User will write why exactly this purchase is necessary');
    table.decimal('claim_amount', 20, 2).nullable();
    table
      .decimal('receive_amount', 20, 2)
      .nullable()
      .comment('a status id from sys_status_flow table');
    table.date('received_date').nullable();
    table.string('remarks', 255).nullable();
    table.integer('insurance_claim_status', 11).nullable();
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
    .hasTable('fam_insurance_claims')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable('fam_insurance_claims', (table) => {
          table.dropForeign('company_id');
          table.dropForeign('insurance_company_id');
          table.dropForeign('maint_request_id');
          table.dropForeign('asset_id');
        });
        return knex.schema.dropTable('fam_insurance_claims');
      }
    });
}
