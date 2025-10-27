import Customer from "#models/customer";
import User from "#models/user";
import { AuthorizationResponse, BasePolicy } from "@adonisjs/bouncer";
import type { AuthorizerResponse } from "@adonisjs/bouncer/types";

export default class CustomerPolicy extends BasePolicy {
  /**
   * Only account managers can list customers
   */
  list(user: User): AuthorizerResponse {
    return user.accountRole === "manager";
  }

  /**
   * Showing a customer is limited to certain users
   */
  show(user: User, customer: Customer): AuthorizerResponse {
    // Deny if the customer account does not match the users account
    if (customer.accountId !== user.accountId) {
      return false;
    }

    // If the user is an account manager, allow access
    if (user.accountRole === "manager") {
      return true;
    }

    // Deny if the customer is assigned to a customer other then the users one. We make this a 404 error
    // to avoid leaking the information of what other customer customer ids exist
    if (customer.id !== user.customerId) {
      return AuthorizationResponse.deny(undefined, 404);
    }
    return true;
  }
}
