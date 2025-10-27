import Customer from "#models/customer";
import { accountIdParamsValidator } from "#validators/account_id";
import { customerIdParamsValidator } from "#validators/customer_id";
import type { HttpContext } from "@adonisjs/core/http";

export default class CustomersController {
  async index({ bouncer, params }: HttpContext) {
    // Make sure the user can list customers
    await bouncer.with("CustomerPolicy").authorize("list");

    const { accountId } = await accountIdParamsValidator.validate(params);
    const customers = await Customer.query().withScopes((scopes) =>
      scopes.partOfAccount(accountId),
    );
    return { customers };
  }

  async show({ bouncer, params, response }: HttpContext) {
    const { accountId, customerId } =
      await customerIdParamsValidator.validate(params);
    const customer = await Customer.query()
      .withScopes((scopes) => scopes.partOfAccount(accountId))
      .andWhere({ id: customerId })
      .first();

    if (!customer) {
      return response.notFound();
    }
    await bouncer.with("CustomerPolicy").authorize("show", customer);

    return { customer };
  }
}
