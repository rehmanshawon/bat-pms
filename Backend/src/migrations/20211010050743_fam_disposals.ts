import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('fam_disposals', (table) => {
    table.increments('disposal_id').notNullable();
    table
      .integer('company_id', 11)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.string('disposal_code', 100).nullable();
    table
      .enum('disposal_type', ['Disposal', 'Write-Off'])
      .defaultTo('Disposal')
      .nullable();
    table
      .integer('asset_id', 11)
      .unsigned()
      .references('asset_id')
      .inTable('fam_assets')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .nullable()
      .index();
    table.date('disposal_date').nullable();
    table.text('remarks').nullable();
    table.integer('disposal_status', 11).nullable();
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
  await knex.schema.hasTable('fam_disposals').then(async function (exists) {
    if (exists) {
      await knex.schema.alterTable('fam_disposals', (table) => {
        table.dropForeign('company_id');
        table.dropForeign('asset_id');
      });
      return knex.schema.dropTable('fam_disposals');
    }
  });
}
