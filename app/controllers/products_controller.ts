import Product from "#models/product";
import { HttpContext } from "@adonisjs/core/http";

export default class ProductsController {
  /**
   * Returns all products for the current account
   */
  async index({ auth }: HttpContext) {
    const user = auth.getUserOrFail();
    const products = await Product.query().withScopes((scopes) =>
      scopes.visibleTo(user),
    );
    return { products };
  }

  /**
   * Returns a single product
   */
  show() {
    // TODO: Implement
    // TODO: Functional tests
  }

  // TODO: Implement creating, updating, and deleting
  // TODO: Implement policies correctly
}
