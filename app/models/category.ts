import { compose } from "@adonisjs/core/helpers";
import { BaseModel, column, manyToMany } from "@adonisjs/lucid/orm";
import type { ManyToMany } from "@adonisjs/lucid/types/relations";
import { PartOfAccount } from "./mixins/part_of_account.js";
import { WithTimestamps } from "./mixins/with_timestamps.js";
import Product from "./product.js";

export default class Category extends compose(
  BaseModel,
  WithTimestamps,
  PartOfAccount,
) {
  @column({ isPrimary: true })
  declare id: string;

  @column()
  declare name: string;

  @column()
  declare order: number;

  /**
   * Relations
   */

  @manyToMany(() => Product)
  declare products: ManyToMany<typeof Product>;
}
