import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('attach_configs', (table) => {
    table.increments('attach_config_id');
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
      .integer('module_id', 10)
      .unsigned()
      .references('module_id')
      .inTable('sys_modules')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .index();
    table.string('attach_name').notNullable();
    table
      .string('attach_config_slug', 20)
      .unique()
      .notNullable()
      .comment('unique slog for attachment configuration');
    table
      .string('reference_table', 100)
      .notNullable()
      .comment('working table name');
    table
      .string('reference_column', 100)
      .notNullable()
      .comment('working table column name');
    table
      .text('allowed_type')
      .notNullable()
      .comment('allowed attachments type');
    table
      .integer('allowed_size', 10)
      .nullable()
      .comment('allowed attachment size');
    table
      .string('attach_path', 50)
      .notNullable()
      .comment('attachment path to be uploaded to');
    table
      .string('attach_upload_label', 100)
      .nullable()
      .comment('attachment upload section label');
    table
      .string('attach_download_label', 100)
      .nullable()
      .comment('attachment download section label');
    table
      .specificType('upload_btn', 'smallint')
      .nullable()
      .defaultTo(0)
      .comment('enable/disable attachment type');
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
    //   ['attach_config_slug', 'company_id'],
    //   'attach_config_company_id_unique_index',
    //   'UNIQUE',
    // );
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.hasTable('attach_configs').then(async function (exists) {
    if (exists) {
      //drop foreign keys before dropping table
      await knex.schema.alterTable('attach_configs', (table) => {
        // table.dropIndex(
        //   ['attach_config_slug', 'company_id'],
        //   'attach_config_company_id_unique_index',
        // );
        table.dropForeign('company_id');
        table.dropForeign('module_id');
      });

      return knex.schema.dropTable('attach_configs');
    }
  });
}
