import { compose } from "@adonisjs/core/helpers";
import { BaseModel, belongsTo, column } from "@adonisjs/lucid/orm";
import type { BelongsTo } from "@adonisjs/lucid/types/relations";
import { WithTimestamps } from "./mixins/with_timestamps.js";
import Order from "./order.js";

export default class OrderLineItem extends compose(BaseModel, WithTimestamps) {
  @column({ isPrimary: true })
  declare id: string;

  @column()
  declare name: string;

  @column()
  declare priceWholesale: number;

  @column()
  declare priceRetail: number;

  @column()
  declare quantity: number;

  @column({
    prepare: (value) => JSON.stringify(value),
  })
  declare imageUrls: string[];

  @column({
    prepare: (value) => JSON.stringify(value),
  })
  declare categories: string[];

  /**
   * Relations
   */

  @column()
  declare orderId: string;
  @belongsTo(() => Order)
  declare order: BelongsTo<typeof Order>;
}
