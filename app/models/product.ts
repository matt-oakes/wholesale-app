import {
  BaseModel,
  belongsTo,
  column,
  manyToMany,
  scope,
} from "@adonisjs/lucid/orm";
import type { BelongsTo, ManyToMany } from "@adonisjs/lucid/types/relations";
import { DateTime } from "luxon";
import Account from "./account.js";
import Category from "./category.js";
import User from "./user.js";

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare name: string;

  @column()
  declare priceWholesale: number;

  @column()
  declare priceRetail: number;

  @column({
    prepare: (value) => JSON.stringify(value),
  })
  declare imageUrls: string[];

  /**
   * Relations
   */

  @column()
  declare accountId: number;

  @belongsTo(() => Account)
  declare account: BelongsTo<typeof Account>;

  @manyToMany(() => Category)
  declare categories: ManyToMany<typeof Category>;

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

  static visibleTo = scope((query, user: User) => {
    // Users can only see products which are part of their account
    query.where("accountId", user.accountId);
  });
}
