import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  protected ordersTableName = "orders";
  protected orderLineItemTableName = "order_line_items";

  async up() {
    this.schema.createTable(this.ordersTableName, (table) => {
      table.increments("id");

      table.text("customer_name").notNullable();
      table.text("customer_address").notNullable();
      table.text("customer_email").notNullable();

      table
        .integer("account_id")
        .notNullable()
        .unsigned()
        .references("id")
        .inTable("accounts")
        .onDelete("CASCADE");
      table
        .integer("customer_id")
        .nullable()
        .unsigned()
        .references("id")
        .inTable("customers")
        .onDelete("CASCADE");

      table.timestamp("created_at");
      table.timestamp("updated_at");
    });

    this.schema.createTable(this.orderLineItemTableName, (table) => {
      table.increments("id");

      table.text("name").notNullable();
      table.integer("price_wholesale").unsigned().notNullable();
      table.integer("price_retail").unsigned().notNullable();
      table.integer("quantity").unsigned().notNullable();
      table.json("image_urls").notNullable();
      table.json("categories").notNullable();

      table
        .integer("order_id")
        .notNullable()
        .unsigned()
        .references("id")
        .inTable(this.ordersTableName)
        .onDelete("CASCADE");

      table.timestamp("created_at");
      table.timestamp("updated_at");
    });
  }

  async down() {
    this.schema.dropTable(this.orderLineItemTableName);
    this.schema.dropTable(this.ordersTableName);
  }
}
