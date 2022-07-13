import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('csa_file_docs', (table) => {
    table
      .integer('unbox_ref_id', 10)
      .unsigned()
      .references('file_requisition_id')
      .inTable('csa_file_requisitions')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.hasTable('csa_file_docs').then(async function (exists) {
    if (exists) {
      await knex.schema.alterTable('csa_file_docs', (table) => {
        table.dropForeign('unbox_ref_id');
      });
    }
  });
}
