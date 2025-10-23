import Account from "#models/account";
import { accountIdParamsValidator } from "#validators/account_id";
import { HttpContext } from "@adonisjs/core/http";

export default class AccountController {
  async show({ params }: HttpContext) {
    const { accountId } = await accountIdParamsValidator.validate(params);
    const account = await Account.findOrFail(accountId);
    return { account };
  }
}
