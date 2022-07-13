import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('sys_approval_modules', (table) => {
    table.increments('approval_module_id');
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
      .string('approval_module_name', 150)
      .notNullable()
      .comment('Approval Module Item box name');
    table.string('icon_class', 120).notNullable();
    table.string('color_class', 15).nullable();
    table
      .string('approval_url', 250)
      .notNullable()
      .comment(
        'action link which is made for the approval process by the module developer',
      );
    table
      .string('details_in_modal_url', 255)
      .nullable()
      .comment('job details modal view');
    table
      .string('details_in_body_url', 255)
      .nullable()
      .comment('job details in body');
    table
      .string('unique_id_logic_slug', 100)
      .nullable()
      .comment('the slug name which is defined in sys_unique_id_logic');
    table.string('master_grid_name', 255).nullable();
    table.text('custom_query').nullable().comment('variable name __USER_ID__');
    //default data
    table.integer('created_by', 10).notNullable();
    table.integer('updated_by', 10).nullable();
    table.integer('deleted_by', 10).nullable();
    table.dateTime('created_at').notNullable();
    table.dateTime('updated_at').nullable();
    table.dateTime('deleted_at').nullable();
    table.specificType('status', 'smallint').defaultTo(1);
    //create composite unique index
    // table.index(
    //   ['unique_id_logic_slug', 'company_id'],
    //   'sys_approval_company_id_unique_index',
    //   'UNIQUE',
    // );
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema
    .hasTable('sys_approval_modules')
    .then(async function (exists) {
      if (exists) {
        await knex.schema.alterTable('sys_approval_modules', (table) => {
          table.dropIndex(
            ['unique_id_logic_slug', 'company_id'],
            'sys_approval_company_id_unique_index',
          );
          table.dropForeign('company_id');
        });
        return knex.schema.dropTable('sys_approval_modules');
      }
    });
}
