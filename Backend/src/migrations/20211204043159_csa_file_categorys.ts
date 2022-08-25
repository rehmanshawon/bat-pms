import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('csa_file_categorys', (table) => {
    table.increments('file_category_id').notNullable();
    table.string('file_category_name', 250).notNullable().unique();
    table.integer('parent_id', 11).nullable();
    table.text('file_category_description').nullable();
    table
      .integer('company_id', 10)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();

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
    .hasTable('csa_file_categorys')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable('csa_file_categorys', (table) => {
          table.dropForeign('company_id');
        });
        return knex.schema.dropTable('csa_file_categorys');
      }
    });
}
