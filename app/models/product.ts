import { compose } from "@adonisjs/core/helpers";
import { BaseModel, column, manyToMany } from "@adonisjs/lucid/orm";
import type { ManyToMany } from "@adonisjs/lucid/types/relations";
import Category from "./category.js";
import { PartOfAccount } from "./mixins/part_of_account.js";
import { WithTimestamps } from "./mixins/with_timestamps.js";

export default class Product extends compose(
  BaseModel,
  WithTimestamps,
  PartOfAccount,
) {
  @column({ isPrimary: true })
  declare id: string;

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

  @manyToMany(() => Category)
  declare categories: ManyToMany<typeof Category>;
}
