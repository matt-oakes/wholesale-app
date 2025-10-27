import Account from "#models/account";
import { NormalizeConstructor } from "@adonisjs/core/types/helpers";
import { BaseModel, belongsTo, column, scope } from "@adonisjs/lucid/orm";
import type { BelongsTo } from "@adonisjs/lucid/types/relations";

export const PartOfAccount = <
  Model extends NormalizeConstructor<typeof BaseModel>,
>(
  superclass: Model,
) => {
  class PartOfAccountClass extends superclass {
    /**
     * Relation
     */

    @column()
    declare accountId: string;

    @belongsTo(() => Account)
    declare account: BelongsTo<typeof Account>;

    /**
     * Scopes
     */

    static partOfAccount = scope((query, accountId: string) => {
      query.where("accountId", accountId);
    });
  }
  return PartOfAccountClass;
};
