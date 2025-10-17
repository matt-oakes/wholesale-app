import Category from "#models/category";
import { HttpContext } from "@adonisjs/core/http";

export default class CategoriesController {
  /**
   * Returns all categories for the current account
   */
  async index({ auth }: HttpContext) {
    const user = auth.getUserOrFail();
    const categories = await Category.query().withScopes((scopes) =>
      scopes.visibleTo(user),
    );
    return { categories };
  }

  /**
   * Returns a single category
   */
  show() {
    // TODO: Implement
    // // TODO: Functional tests
  }

  // TODO: Implement creating, updating, and deleting
  // TODO: Implement policies correctly
}
