import { AccountFactory } from "#database/factories/account_factory";
import { CategoryFactory } from "#database/factories/category_factory";
import { UserFactory } from "#database/factories/user_factory";
import User from "#models/user";
import { test } from "@japa/runner";

test.group("categories/show", () => {
  test("error when not authenticated", async ({ client }) => {
    const category = await CategoryFactory.with("account").create();
    const { account } = category;

    // Make the request
    const response = await client
      .get(`/accounts/${account.id}/categories/${category.id}`)
      .headers({});

    response.assertUnauthorized();
  });

  test("error when passing invalid auth token", async ({ client }) => {
    const account = await AccountFactory.create();

    // Make the request
    const response = await client
      .get(`/accounts/${account.id}/categories`)
      .headers({ Authorization: "Bearer invalid-token" });

    response.assertUnauthorized();
  });

  test("error when attempting to access a category of a different account", async ({
    client,
  }) => {
    const category1 = await CategoryFactory.with("account").create();
    const { account: account1 } = category1;
    const category2 = await CategoryFactory.with("account").create();
    const { account: account2 } = category2;

    const account1User = await UserFactory.merge({
      accountId: account1.id,
    }).create();
    const account1UserToken = await User.accessTokens.create(account1User);
    const account1UserTokenString = account1UserToken.value!.release();

    // Make the request
    const response = await client
      .get(`/accounts/${account2.id}/categories/${category2.id}`)
      .headers({ Authorization: `Bearer ${account1UserTokenString}` });

    response.assertForbidden();
  });

  test("error when the requested category id doesn't exist on the given account", async ({
    client,
  }) => {
    const category1 = await CategoryFactory.with("account", 1, (account) =>
      account.with("users"),
    ).create();
    const { account: account1 } = category1;

    const category2 = await CategoryFactory.with("account").create();

    const account1User = await account1.related("users").query().firstOrFail();
    const account1UserToken = await User.accessTokens.create(account1User);
    const response = await client
      .get(`/accounts/${account1.id}/categories/${category2.id}`)
      .headers({
        Authorization: `Bearer ${account1UserToken.value!.release()}`,
      });
    response.assertNotFound();
  });

  test("not found error when the requested category id doesn't exist", async ({
    client,
  }) => {
    const category1 = await CategoryFactory.with("account", 1, (account) =>
      account.with("users"),
    ).create();
    const { account: account1 } = category1;

    const account1User = await account1.related("users").query().firstOrFail();
    const account1UserToken = await User.accessTokens.create(account1User);
    const response = await client
      .get(`/accounts/${account1.id}/categories/cat_invalid`)
      .headers({
        Authorization: `Bearer ${account1UserToken.value!.release()}`,
      });
    response.assertNotFound();
  });

  test("returns the category when it exists on the account", async ({
    client,
    expect,
  }) => {
    const account1 = await AccountFactory.with("users", 1).create();
    const category1 = await CategoryFactory.merge({
      accountId: account1.id,
    }).create();

    const account1User = await account1.related("users").query().firstOrFail();
    const account1UserToken = await User.accessTokens.create(account1User);
    const response = await client
      .get(`/accounts/${account1.id}/categories/${category1.id}`)
      .headers({
        Authorization: `Bearer ${account1UserToken.value!.release()}`,
      });
    response.assertOk();

    expect(response.body()).toEqual({ category: category1.toJSON() });
  });
});
