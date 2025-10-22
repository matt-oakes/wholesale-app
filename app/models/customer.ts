import { BaseModel, belongsTo, column, hasMany } from "@adonisjs/lucid/orm";
import type { BelongsTo, HasMany } from "@adonisjs/lucid/types/relations";
import { DateTime } from "luxon";
import Account from "./account.js";
import Order from "./order.js";

export default class Customer extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare name: string;

  @column()
  declare billingEmail: string;

  /**
   * Relations
   */

  @column()
  declare accountId: number;
  @belongsTo(() => Account)
  declare account: BelongsTo<typeof Account>;

  @hasMany(() => Order)
  declare orders: HasMany<typeof Order>;

  /**
   * Meta
   */

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;
}
