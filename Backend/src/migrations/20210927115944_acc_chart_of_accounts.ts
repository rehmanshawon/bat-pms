import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('acc_chart_of_accounts', (table) => {
    table.increments('chart_of_account_id').notNullable();
    table
      .integer('company_id', 10)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.bigInteger('account_code').unique().notNullable();
    table.integer('manual_account_code', 11).nullable();
    table
      .specificType('is_group', 'smallint')
      .notNullable()
      .comment(
        'if is_group = 1 that means this is a group head & it may have different ledger.else if is_group = 0 it means this is a ledger / account head',
      );
    table
      .specificType('is_cash', 'smallint')
      .nullable()
      .comment('if this account head is a cash account');
    table
      .specificType('is_bank', 'smallint')
      .nullable()
      .comment('if this account head is a bank account');
    table
      .integer('parent_id', 11)
      .notNullable()
      .defaultTo(0)
      .comment(
        'parent account ID. Example : If this head is under different group / mother head than that id will be placed here.',
      );
    table.string('custom_group', 255).nullable();
    table.string('account_name', 200).notNullable().comment('Account Name');
    table
      .string('account_description', 200)
      .nullable()
      .comment('Account Description');
    table
      .enum('account_type', ['Asset', 'Liability', 'Income', 'Expenditure'])
      .notNullable()
      .comment('example: Asset code-10, liability-20,income-30,expenditure-40');
    table.integer('bank_id', 11).nullable();
    table.integer('bank_branch_id', 11).nullable();
    table.integer('plbs_group_code').notNullable();
    //create composite unique index
    // table.index(
    //   ['account_code', 'company_id'],
    //   'acc_chart_accounts_company_id_unique_index',
    //   'UNIQUE',
    // );
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
  await knex.schema
    .hasTable('acc_chart_of_accounts')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable('acc_chart_of_accounts', (table) => {
          // table.dropIndex(
          //   ['account_code', 'company_id'],
          //   'acc_chart_accounts_company_id_unique_index',
          // );
          table.dropForeign('company_id');
        });
        return knex.schema.dropTable('acc_chart_of_accounts');
      }
    });
}
