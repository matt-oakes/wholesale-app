import Order from "#models/order";
import type { HttpContext } from "@adonisjs/core/http";

export default class OrdersController {
  /**
   * Returns all orders for the current user
   */
  async index({ auth }: HttpContext) {
    const user = auth.getUserOrFail();
    const orders = await Order.query()
      .withScopes((scopes) => scopes.visibleTo(user))
      .preload("lineItems");
    return { orders };
  }

  /**
   * Returns a single order
   */
  show() {
    // TODO: Implement
    // TODO: Functional tests
  }

  // TODO: Implement creating, updating, and deleting
  // TODO: Implement policies correctly
}
