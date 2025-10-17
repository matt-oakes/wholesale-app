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
import Product from "./product.js";
import User from "./user.js";

export default class Category extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare name: string;

  @column()
  declare order: number;

  /**
   * Relations
   */

  @column()
  declare accountId: number;

  @belongsTo(() => Account)
  declare account: BelongsTo<typeof Account>;

  @manyToMany(() => Product)
  declare products: ManyToMany<typeof Product>;

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
    // Users can only see categories which are part of their account
    query.where("accountId", user.accountId);
  });
}
