import { DbAccessTokensProvider } from "@adonisjs/auth/access_tokens";
import { withAuthFinder } from "@adonisjs/auth/mixins/lucid";
import { compose } from "@adonisjs/core/helpers";
import hash from "@adonisjs/core/services/hash";
import { BaseModel, belongsTo, column, computed } from "@adonisjs/lucid/orm";
import type { BelongsTo } from "@adonisjs/lucid/types/relations";
import Customer from "./customer.js";
import { PartOfAccount } from "./mixins/part_of_account.js";
import { WithTimestamps } from "./mixins/with_timestamps.js";

const AuthFinder = withAuthFinder(() => hash.use("scrypt"), {
  uids: ["email"],
  passwordColumnName: "password",
});

export type AccountRole = "customer" | "manager";

export default class User extends compose(
  BaseModel,
  AuthFinder,
  WithTimestamps,
  PartOfAccount,
) {
  @column({ isPrimary: true })
  declare id: string;

  @column()
  declare firstName: string;

  @column()
  declare lastName: string;

  @column()
  declare email: string;

  @column({ serializeAs: null })
  declare password: string;

  /**
   * Relations
   */

  @column()
  declare customerId: string | null;
  @belongsTo(() => Customer)
  declare customer: BelongsTo<typeof Customer>;

  /**
   * Computed properties
   */

  @computed()
  get accountRole(): AccountRole {
    return this.customerId ? "customer" : "manager";
  }

  /**
   * Static
   */

  static accessTokens = DbAccessTokensProvider.forModel(User);
}
