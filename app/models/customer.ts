import { compose } from "@adonisjs/core/helpers";
import { BaseModel, column, hasMany } from "@adonisjs/lucid/orm";
import type { HasMany } from "@adonisjs/lucid/types/relations";
import { PartOfAccount } from "./mixins/part_of_account.js";
import { WithTimestamps } from "./mixins/with_timestamps.js";
import Order from "./order.js";

export default class Customer extends compose(
  BaseModel,
  WithTimestamps,
  PartOfAccount,
) {
  @column({ isPrimary: true })
  declare id: string;

  @column()
  declare name: string;

  @column()
  declare billingEmail: string;

  /**
   * Relations
   */

  @hasMany(() => Order)
  declare orders: HasMany<typeof Order>;
}
