import { compose } from "@adonisjs/core/helpers";
import { BaseModel, column, hasMany } from "@adonisjs/lucid/orm";
import type { HasMany } from "@adonisjs/lucid/types/relations";
import Category from "./category.js";
import Customer from "./customer.js";
import { WithTimestamps } from "./mixins/with_timestamps.js";
import Order from "./order.js";
import Product from "./product.js";
import User from "./user.js";

export default class Account extends compose(BaseModel, WithTimestamps) {
  @column({ isPrimary: true })
  declare id: string;

  @column()
  declare slug: string;

  @column()
  declare name: string;

  /**
   * Relations
   */

  @hasMany(() => Category)
  declare categories: HasMany<typeof Category>;

  @hasMany(() => Customer)
  declare customers: HasMany<typeof Customer>;

  @hasMany(() => Order)
  declare orders: HasMany<typeof Order>;

  @hasMany(() => Product)
  declare products: HasMany<typeof Product>;

  @hasMany(() => User)
  declare users: HasMany<typeof User>;
}
