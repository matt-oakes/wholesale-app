import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  protected accountsTableName = "accounts";
  protected usersTableName = "users";

  async up() {
    this.schema.createTable(this.accountsTableName, (table) => {
      table.increments("id").notNullable().primary();
      table.string("slug").notNullable();
      table.string("name").notNullable();

      table.timestamp("created_at").notNullable();
      table.timestamp("updated_at").nullable();
    });

    this.schema.createTable(this.usersTableName, (table) => {
      table.increments("id").notNullable();
      table.string("first_name").notNullable();
      table.string("last_name").notNullable();
      table.string("email").notNullable();
      table.string("password").notNullable();

      table
        .integer("account_id")
        .notNullable()
        .unsigned()
        .references("id")
        .inTable(this.accountsTableName)
        .onDelete("CASCADE");
      table.enum("account_role", ["owner", "buyer"]).notNullable();

      table.timestamp("created_at").notNullable();
      table.timestamp("updated_at").nullable();

      table.unique(["email", "account_id"]);
    });
  }

  async down() {
    this.schema.dropTable(this.usersTableName);
    this.schema.dropTable(this.accountsTableName);
  }
}
