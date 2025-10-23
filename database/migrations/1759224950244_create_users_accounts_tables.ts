import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  protected accountsTableName = "accounts";
  protected customersTableName = "customers";
  protected usersTableName = "users";

  async up() {
    this.schema.createTable(this.accountsTableName, (table) => {
      table
        .text("id")
        .notNullable()
        .primary()
        .defaultTo(this.raw("nanoid('acc_')"));
      table.string("slug").notNullable();
      table.string("name").notNullable();

      table.timestamp("created_at").notNullable();
      table.timestamp("updated_at").nullable();
    });

    this.schema.createTable(this.customersTableName, (table) => {
      table
        .text("id")
        .notNullable()
        .primary()
        .defaultTo(this.raw("nanoid('cus_')"));
      table.string("name").notNullable();
      table.string("billing_email").notNullable();

      table
        .text("account_id")
        .notNullable()
        .references("id")
        .inTable(this.accountsTableName)
        .onDelete("CASCADE");

      table.timestamp("created_at").notNullable();
      table.timestamp("updated_at").nullable();
    });

    this.schema.createTable(this.usersTableName, (table) => {
      table
        .text("id")
        .notNullable()
        .primary()
        .defaultTo(this.raw("nanoid('usr_')"));
      table.string("first_name").notNullable();
      table.string("last_name").notNullable();
      table.string("email").notNullable();
      table.string("password").notNullable();

      table
        .text("account_id")
        .notNullable()
        .references("id")
        .inTable(this.accountsTableName)
        .onDelete("CASCADE");
      table
        .text("customer_id")
        .nullable()
        .references("id")
        .inTable(this.customersTableName)
        .onDelete("CASCADE");

      table.timestamp("created_at").notNullable();
      table.timestamp("updated_at").nullable();

      table.unique(["email", "account_id"]);
    });
  }

  async down() {
    this.schema.dropTableIfExists(this.usersTableName);
    this.schema.dropTableIfExists(this.customersTableName);
    this.schema.dropTableIfExists(this.accountsTableName);
  }
}
