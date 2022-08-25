import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('acc_plbs_items', (table) => {
    table.bigIncrements('plbs_id').notNullable();
    table
      .integer('company_id', 10)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    //table.bigInteger('plbs_code').notNullable();
    table.bigInteger('plbs_code').notNullable().unsigned().unique().index();
    table.integer('manual_plbs_code', 11).nullable();
    table.string('account_name', 150).notNullable();
    table.integer('parent_code', 11).notNullable().defaultTo(0);
    table
      .enum('account_type', ['Asset', 'Liability', 'Income', 'Expenditure'])
      .notNullable()
      .comment('example: Asset code-10, liability-20,income-30,expenditure-40');
    table.specificType('is_group', 'smallint').notNullable();
    table.integer('sort_number', 11).nullable();
    table.string('note_no', 50).nullable();
    table.string('reference', 50).nullable();
    table.dateTime('last_update').nullable();
    //default data
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
  await knex.schema.hasTable('acc_plbs_items').then(async function (exists) {
    if (exists) {
      await knex.schema.alterTable('acc_plbs_items', (table) => {
        table.dropForeign('company_id');
      });
      return knex.schema.dropTable('acc_plbs_items');
    }
  });
}
