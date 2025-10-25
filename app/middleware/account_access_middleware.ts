import { accountIdParamsValidator } from "#validators/account_id";
import { type HttpContext } from "@adonisjs/core/http";
import type { NextFn } from "@adonisjs/core/types/http";

/**
 * Ensures that the current user access access to the account which is requested by the accountId param.
 * This must be called after the auth middleware to ensure there is a user to check
 */
export default class AccountAccessMiddleware {
  async handle({ auth, params, response }: HttpContext, next: NextFn) {
    // Get the accountId param and ensure the current user has access to it
    const { accountId } = await accountIdParamsValidator.validate(params);
    const user = auth.getUserOrFail();
    if (user.accountId !== accountId) {
      return response.forbidden();
    }

    // This passed, so continue with the middleware chain
    return next();
  }
}
