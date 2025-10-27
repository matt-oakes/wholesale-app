import Order from "#models/order";
import { accountIdParamsValidator } from "#validators/account_id";
import { customerIdOptionalValidator } from "#validators/customer_id";
import { orderIdParamsValidator } from "#validators/order_id";
import { HttpContext } from "@adonisjs/core/http";

export default class OrdersController {
  /**
   * Returns all orders for the current users account
   */
  async index({ bouncer, request, params }: HttpContext) {
    const { customerId } = await customerIdOptionalValidator.validate(
      request.all(),
    );

    if (customerId) {
      await bouncer.with("OrderPolicy").authorize("listCustomer", customerId);
    } else {
      await bouncer.with("OrderPolicy").authorize("listAll");
    }

    const { accountId } = await accountIdParamsValidator.validate(params);
    let ordersQuery = Order.query().withScopes((scopes) =>
      scopes.partOfAccount(accountId),
    );
    if (customerId) {
      ordersQuery = ordersQuery.andWhere({ customerId });
    }
    const orders = await ordersQuery;
    return { orders };
  }

  /**
   * Returns a single order, if the user has permission
   */
  async show({ bouncer, response, params }: HttpContext) {
    const { accountId, orderId } =
      await orderIdParamsValidator.validate(params);
    const order = await Order.query()
      .withScopes((scopes) => scopes.partOfAccount(accountId))
      .andWhere({ id: orderId })
      .first();

    if (!order) {
      return response.notFound();
    }
    await bouncer.with("OrderPolicy").authorize("showOrder", order);

    return { order };
  }

  // TODO: Implement creating, updating, and deleting
}
