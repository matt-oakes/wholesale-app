import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  protected accountsTableName = "accounts";
  protected categoriesTableName = "categories";
  protected productsTableName = "products";
  protected pivotTableName = "category_product";

  async up() {
    this.schema.createTable(this.categoriesTableName, (table) => {
      table
        .text("id")
        .notNullable()
        .primary()
        .defaultTo(this.raw("nanoid('cat_')"));
      table.text("name").notNullable();
      table.integer("order").notNullable().unsigned();

      table
        .text("account_id")
        .notNullable()
        .unsigned()
        .references("id")
        .inTable(this.accountsTableName)
        .onDelete("CASCADE");

      table.timestamp("created_at");
      table.timestamp("updated_at");
    });

    this.schema.createTable(this.productsTableName, (table) => {
      table
        .text("id")
        .notNullable()
        .primary()
        .defaultTo(this.raw("nanoid('prd_')"));
      table.text("name").notNullable();
      table.integer("price_wholesale").unsigned().notNullable();
      table.integer("price_retail").unsigned().notNullable();
      table.json("image_urls").notNullable();

      table
        .text("account_id")
        .notNullable()
        .references("id")
        .inTable(this.accountsTableName)
        .onDelete("CASCADE");

      table.timestamp("created_at");
      table.timestamp("updated_at");
    });

    this.schema.createTable(this.pivotTableName, (table) => {
      table.increments("id").primary();

      table
        .text("category_id")
        .notNullable()
        .references("id")
        .inTable(this.categoriesTableName)
        .onDelete("CASCADE");
      table
        .text("product_id")
        .notNullable()
        .references("id")
        .inTable(this.productsTableName)
        .onDelete("CASCADE");

      table.timestamp("created_at");
      table.timestamp("updated_at");

      table.unique(["category_id", "product_id"]);
    });
  }

  async down() {
    this.schema.dropTableIfExists(this.pivotTableName);
    this.schema.dropTableIfExists(this.productsTableName);
    this.schema.dropTableIfExists(this.categoriesTableName);
  }
}
