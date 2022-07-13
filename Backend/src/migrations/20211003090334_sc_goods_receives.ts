import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('sc_goods_receives', (table) => {
    table.increments('goods_receive_id').notNullable();
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
      .integer('requisition_id', 11)
      .unsigned()
      .references('requisition_id')
      .inTable('sc_requisitions')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .index();
    table
      .integer('product_id', 10)
      .unsigned()
      .references('product_id')
      .inTable('config_products')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .index();
    table.decimal('receive_qty', 18, 5).notNullable();
    table.date('receive_date').notNullable();
    table
      .integer('goods_receive_person_id', 11)
      .unsigned()
      .references('employee_id')
      .inTable('config_employees')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
      .nullable()
      .index();
    table.text('remarks').nullable();
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
  await knex.schema.hasTable('sc_goods_receives').then(async function (exists) {
    if (exists) {
      await knex.schema.alterTable('sc_goods_receives', (table) => {
        table.dropForeign('company_id');
        table.dropForeign('requisition_id');
        table.dropForeign('product_id');
        table.dropForeign('goods_receive_person_id');
      });
      return knex.schema.dropTable('sc_goods_receives');
    }
  });
}
