import { DbAccessTokensProvider } from "@adonisjs/auth/access_tokens";
import { withAuthFinder } from "@adonisjs/auth/mixins/lucid";
import { compose } from "@adonisjs/core/helpers";
import hash from "@adonisjs/core/services/hash";
import { BaseModel, belongsTo, column } from "@adonisjs/lucid/orm";
import type { BelongsTo } from "@adonisjs/lucid/types/relations";
import { DateTime } from "luxon";
import Account from "./account.js";

const AuthFinder = withAuthFinder(() => hash.use("scrypt"), {
  uids: ["email"],
  passwordColumnName: "password",
});

export type AccountRole = "owner" | "buyer";

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number;

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
  declare accountId: number;

  @belongsTo(() => Account)
  declare account: BelongsTo<typeof Account>;

  @column()
  declare accountRole: AccountRole;

  /**
   * Meta
   */

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null;

  /**
   * Static
   */

  static accessTokens = DbAccessTokensProvider.forModel(User);
}
