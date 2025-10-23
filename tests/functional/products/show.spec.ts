import { AccountFactory } from "#database/factories/account_factory";
import { ProductFactory } from "#database/factories/product_factory";
import { UserFactory } from "#database/factories/user_factory";
import User from "#models/user";
import { test } from "@japa/runner";

test.group("products/show", () => {
  test("error when not authenticated", async ({ client }) => {
    const product = await ProductFactory.with("account").create();
    const { account } = product;

    // Make the request
    const response = await client
      .get(`/accounts/${account.id}/products/${product.id}`)
      .headers({});

    response.assertUnauthorized();
  });

  test("error when passing invalid auth token", async ({ client }) => {
    const account = await AccountFactory.create();

    // Make the request
    const response = await client
      .get(`/accounts/${account.id}/products`)
      .headers({ Authorization: "Bearer invalid-token" });

    response.assertUnauthorized();
  });

  test("error when attempting to access a product of a different account", async ({
    client,
  }) => {
    const product1 = await ProductFactory.with("account").create();
    const { account: account1 } = product1;
    const product2 = await ProductFactory.with("account").create();
    const { account: account2 } = product2;

    const account1User = await UserFactory.merge({
      accountId: account1.id,
    }).create();
    const account1UserToken = await User.accessTokens.create(account1User);
    const account1UserTokenString = account1UserToken.value!.release();

    // Make the request
    const response = await client
      .get(`/accounts/${account2.id}/products/${product2.id}`)
      .headers({ Authorization: `Bearer ${account1UserTokenString}` });

    response.assertUnauthorized();
  });

  test("error when the requested product id doesn't exist on the given account", async ({
    client,
  }) => {
    const product1 = await ProductFactory.with("account", 1, (account) =>
      account.with("users"),
    ).create();
    const { account: account1 } = product1;

    const product2 = await ProductFactory.with("account").create();

    const account1User = await account1.related("users").query().firstOrFail();
    const account1UserToken = await User.accessTokens.create(account1User);
    const response = await client
      .get(`/accounts/${account1.id}/products/${product2.id}`)
      .headers({
        Authorization: `Bearer ${account1UserToken.value!.release()}`,
      });
    response.assertNotFound();
  });

  test("not found error when the requested product id doesn't exist", async ({
    client,
  }) => {
    const product1 = await ProductFactory.with("account", 1, (account) =>
      account.with("users"),
    ).create();
    const { account: account1 } = product1;

    const account1User = await account1.related("users").query().firstOrFail();
    const account1UserToken = await User.accessTokens.create(account1User);
    const response = await client
      .get(`/accounts/${account1.id}/products/prd_invalid`)
      .headers({
        Authorization: `Bearer ${account1UserToken.value!.release()}`,
      });
    response.assertNotFound();
  });

  test("returns the product when it exists on the account", async ({
    client,
    expect,
  }) => {
    const account1 = await AccountFactory.with("users", 1).create();
    const product1 = await ProductFactory.merge({
      accountId: account1.id,
    }).create();

    const account1User = await account1.related("users").query().firstOrFail();
    const account1UserToken = await User.accessTokens.create(account1User);
    const response = await client
      .get(`/accounts/${account1.id}/products/${product1.id}`)
      .headers({
        Authorization: `Bearer ${account1UserToken.value!.release()}`,
      });
    response.assertOk();

    expect(response.body()).toEqual({ product: product1.toJSON() });
  });
});
