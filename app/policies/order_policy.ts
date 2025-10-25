import Order from "#models/order";
import User from "#models/user";
import { AuthorizationResponse, BasePolicy } from "@adonisjs/bouncer";
import type { AuthorizerResponse } from "@adonisjs/bouncer/types";

export default class OrderPolicy extends BasePolicy {
  /**
   * Only account managers can list all orders
   */
  listAll(user: User): AuthorizerResponse {
    return user.accountRole === "manager";
  }

  /**
   * Only account managers or a user assigned to the requested customer can list customer orders
   */
  listCustomer(user: User, customerId: string): AuthorizerResponse {
    return user.accountRole === "manager" || user.customerId === customerId;
  }

  /**
   * Showing an order is limited to certain users
   */
  showOrder(user: User, order: Order): AuthorizerResponse {
    // Deny if the order account does not match the users account
    if (order.accountId !== user.accountId) {
      return false;
    }

    // If the user is an account manager, allow access
    if (user.accountRole === "manager") {
      return true;
    }

    // Deny if the order is assigned to a customer other then the users one. We make this a 404 error
    // to avoid leaking the information of what other customer order ids exist
    if (order.customerId !== user.customerId) {
      return AuthorizationResponse.deny(undefined, 404);
    }
    return true;
  }
}
