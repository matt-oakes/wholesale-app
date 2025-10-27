import { compose } from "@adonisjs/core/helpers";
import { BaseModel, belongsTo, column, hasMany } from "@adonisjs/lucid/orm";
import type { BelongsTo, HasMany } from "@adonisjs/lucid/types/relations";
import Customer from "./customer.js";
import { PartOfAccount } from "./mixins/part_of_account.js";
import { WithTimestamps } from "./mixins/with_timestamps.js";
import OrderLineItem from "./order_line_item.js";

export default class Order extends compose(
  BaseModel,
  WithTimestamps,
  PartOfAccount,
) {
  @column({ isPrimary: true })
  declare id: string;

  @column()
  declare customerName: string;

  @column()
  declare customerAddress: string;

  @column()
  declare customerEmail: string;

  /**
   * Relations
   */

  @column()
  declare customerId: string | null;
  @belongsTo(() => Customer)
  declare customer: BelongsTo<typeof Customer> | null;

  @hasMany(() => OrderLineItem)
  declare lineItems: HasMany<typeof OrderLineItem>;
}
