import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('sys_generated_ids', (table) => {
    table.increments('generated_id');
    table
      .integer('company_id', 10)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table
      .integer('sequential_id', 10)
      .notNullable()
      .comment('sequential generated id');
    table
      .string('actual_id', 20)
      .notNullable()
      .comment('actual generated id with prefix and others');
    table.dateTime('created_at').defaultTo(knex.fn.now());
    table
      .string('id_token', 20)
      .nullable()
      .comment('id token logic for generated id checking');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.hasTable('sys_generated_ids').then(async function (exists) {
    if (exists) {
      await knex.schema.alterTable('sys_generated_ids', (table) => {
        table.dropForeign('company_id');
      });
      return knex.schema.dropTable('sys_generated_ids');
    }
  });
}
