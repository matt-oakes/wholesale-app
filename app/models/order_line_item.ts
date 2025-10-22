import { BaseModel, belongsTo, column } from "@adonisjs/lucid/orm";
import type { BelongsTo } from "@adonisjs/lucid/types/relations";
import { DateTime } from "luxon";
import Order from "./order.js";

export default class OrderLineItem extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

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
  declare orderId: number;
  @belongsTo(() => Order)
  declare order: BelongsTo<typeof Order>;

  /**
   * Meta
   */

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;
}
