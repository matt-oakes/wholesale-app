import Category from "#models/category";
import { accountIdParamsValidator } from "#validators/account_id";
import { categoryIdParamsValidator } from "#validators/category_id";
import { HttpContext } from "@adonisjs/core/http";

export default class CategoriesController {
  /**
   * Returns all categories for the current account
   */
  async index({ params }: HttpContext) {
    const { accountId } = await accountIdParamsValidator.validate(params);
    const categories = await Category.query().withScopes((scopes) =>
      scopes.partOfAccount(accountId),
    );
    return { categories };
  }

  /**
   * Returns a single category
   */
  async show({ params, response }: HttpContext) {
    const { accountId, categoryId } =
      await categoryIdParamsValidator.validate(params);
    const category = await Category.query()
      .withScopes((scopes) => scopes.partOfAccount(accountId))
      .andWhere({ id: categoryId })
      .first();
    if (!category) {
      return response.notFound();
    }
    return { category };
  }

  // TODO: Implement creating, updating, and deleting
  // TODO: Implement policies correctly
}
