import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('sys_master_grids', (table) => {
    table.increments('master_grid_id');
    table.integer('module_id', 10).nullable();
    table
      .integer('company_id', 10)
      .unsigned()
      .references('company_id')
      .inTable('sys_companys')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .notNullable()
      .index();
    table.string('master_grid_slug', 50).notNullable();
    table
      .string('master_entry_name', 50)
      .nullable()
      .comment('sys_master_entrys');
    table.string('master_entry_url', 100).nullable();
    table.string('master_grid_title', 100).notNullable();
    table.text('master_column_title', 'tinytext').nullable();
    table.text('sql_select').notNullable().comment('SQL STATEMNTS');
    table.text('sql_source').notNullable().comment('SQL STATEMNTS');
    table.text('sql_condition').nullable().comment('SQL STATEMNTS');
    table.text('sql_group_by').nullable().comment('SQL STATEMNTS');
    table.text('sql_having').nullable().comment('SQL STATEMNTS');
    table.text('sql_order_by').nullable().comment('SQL STATEMNTS');
    table.text('sql_limit').nullable();
    table
      .string('action_table', 50)
      .notNullable()
      .comment('main grid table working on');
    table
      .string('primary_key_field', 50)
      .notNullable()
      .comment('action table primary key field');
    table.string('data_link', 100).nullable();
    table.string('status_field', 100).nullable();
    table.string('search_panel_slug', 50).nullable();
    table.string('hide_col_position', 100).notNullable();
    table.text('search_columns').nullable();
    table.text('tr_data_attr').nullable();
    table.specificType('enable_form', 'smallint').defaultTo(1).nullable();
    table.specificType('select_all_btn', 'smallint').nullable();
    table.string('additional_grid', 50).nullable();
    table.specificType('export_excel', 'smallint').defaultTo(0).nullable();
    table.specificType('export_pdf', 'smallint').defaultTo(0).nullable();
    table.specificType('export_csv', 'smallint').defaultTo(0).nullable();
    table.specificType('export_printing', 'smallint').defaultTo(0).nullable();
    table.specificType('client_side', 'smallint').defaultTo(0).nullable();
    table.text('page_customize', 'tinytext').nullable();
    table.specificType('grid_checkbox', 'smallint').defaultTo(0).notNullable();
    table.specificType('grid_serial', 'smallint').defaultTo(0).notNullable();
    table.specificType('tagg_html', 'smallint').defaultTo(0).notNullable();
    //defualt value
    table.integer('created_by', 10).notNullable();
    table.integer('updated_by', 10).nullable();
    table.integer('deleted_by', 10).nullable();
    table.dateTime('created_at').notNullable();
    table.dateTime('updated_at').nullable();
    table.dateTime('deleted_at').nullable();
    table.specificType('status', 'smallint').defaultTo(1);
    //create composite unique index
    // table.index(
    //   ['master_grid_slug', 'company_id'],
    //   'sys_master_grid_company_id_unique_index',
    //   'UNIQUE',
    // );
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.hasTable('sys_master_grids').then(async function (exists) {
    if (exists) {
      await knex.schema.alterTable('sys_master_grids', (table) => {
        // table.dropIndex(
        //   ['master_grid_slug', 'company_id'],
        //   'sys_master_grid_company_id_unique_index',
        // );
        table.dropForeign('company_id');
      });
      return knex.schema.dropTable('sys_master_grids');
    }
  });
}
