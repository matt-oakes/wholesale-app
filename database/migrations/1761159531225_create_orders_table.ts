import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  protected ordersTableName = "orders";
  protected orderLineItemTableName = "order_line_items";

  async up() {
    this.schema.createTable(this.ordersTableName, (table) => {
      table
        .text("id")
        .notNullable()
        .primary()
        .defaultTo(this.raw("nanoid('ord_')"));

      table.text("customer_name").notNullable();
      table.text("customer_address").notNullable();
      table.text("customer_email").notNullable();

      table
        .text("account_id")
        .notNullable()
        .references("id")
        .inTable("accounts")
        .onDelete("CASCADE");
      table
        .text("customer_id")
        .nullable()
        .references("id")
        .inTable("customers")
        .onDelete("CASCADE");

      table.timestamp("created_at");
      table.timestamp("updated_at");
    });

    this.schema.createTable(this.orderLineItemTableName, (table) => {
      table
        .text("id")
        .notNullable()
        .primary()
        .defaultTo(this.raw("nanoid('oli_')"));

      table.text("name").notNullable();
      table.integer("price_wholesale").unsigned().notNullable();
      table.integer("price_retail").unsigned().notNullable();
      table.integer("quantity").unsigned().notNullable();
      table.json("image_urls").notNullable();
      table.json("categories").notNullable();

      table
        .text("order_id")
        .notNullable()
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
