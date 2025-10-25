import {
  BaseModel,
  belongsTo,
  column,
  hasMany,
  scope,
} from "@adonisjs/lucid/orm";
import type { BelongsTo, HasMany } from "@adonisjs/lucid/types/relations";
import { DateTime } from "luxon";
import Account from "./account.js";
import Customer from "./customer.js";
import OrderLineItem from "./order_line_item.js";

export default class Order extends BaseModel {
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
  declare accountId: string;
  @belongsTo(() => Account)
  declare account: BelongsTo<typeof Account>;

  @column()
  declare customerId: string | null;
  @belongsTo(() => Customer)
  declare customer: BelongsTo<typeof Customer> | null;

  @hasMany(() => OrderLineItem)
  declare lineItems: HasMany<typeof OrderLineItem>;

  /**
   * Meta
   */

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;

  /**
   * Static
   */

  static partOfAccount = scope((query, accountId: string) => {
    query.where("accountId", accountId);
  });
}
