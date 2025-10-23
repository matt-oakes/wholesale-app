import Product from "#models/product";
import { accountIdParamsValidator } from "#validators/account_id";
import { productIdParamsValidator } from "#validators/product_id";
import { HttpContext } from "@adonisjs/core/http";

export default class ProductsController {
  /**
   * Returns all products for the current account
   */
  async index({ params }: HttpContext) {
    const { accountId } = await accountIdParamsValidator.validate(params);
    const products = await Product.query().withScopes((scopes) =>
      scopes.partOfAccount(accountId),
    );
    return { products };
  }

  /**
   * Returns a single product
   */
  async show({ params, response }: HttpContext) {
    const { accountId, productId } =
      await productIdParamsValidator.validate(params);
    const product = await Product.query()
      .withScopes((scopes) => scopes.partOfAccount(accountId))
      .andWhere({ id: productId })
      .first();
    if (!product) {
      return response.notFound();
    }
    return { product };
  }

  // TODO: Implement creating, updating, and deleting
  // TODO: Implement policies correctly
}
