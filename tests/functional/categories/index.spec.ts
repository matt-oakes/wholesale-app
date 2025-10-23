import { AccountFactory } from "#database/factories/account_factory";
import { UserFactory } from "#database/factories/user_factory";
import User from "#models/user";
import { test } from "@japa/runner";

test.group("categories/index", () => {
  test("error when not authenticated", async ({ client }) => {
    const account = await AccountFactory.create();

    // Make the request
    const response = await client
      .get(`/accounts/${account.id}/categories`)
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

  test("error when attempting to access categories of a different account", async ({
    client,
  }) => {
    const account1 = await AccountFactory.merge({
      name: "Account 1",
      slug: "account1",
    }).create();
    const account2 = await AccountFactory.merge({
      name: "Account 2",
      slug: "account2",
    }).create();

    const account1User = await UserFactory.merge({
      accountId: account1.id,
    }).create();
    const account1UserToken = await User.accessTokens.create(account1User);
    const account1UserTokenString = account1UserToken.value!.release();

    // Make the request
    const response = await client
      .get(`/accounts/${account2.id}/categories`)
      .headers({ Authorization: `Bearer ${account1UserTokenString}` });

    response.assertUnauthorized();
  });

  test("empty array when there are no categories for the account", async ({
    client,
    expect,
  }) => {
    // The account the user does have access to has no categories
    const account1 = await AccountFactory.with("users", 1).create();

    // Create another account which the user does not have access to with categories
    await AccountFactory.with("users", 1).with("categories", 5).create();

    const account1User = await account1.related("users").query().firstOrFail();
    const account1UserToken = await User.accessTokens.create(account1User);
    const response = await client
      .get(`/accounts/${account1.id}/categories`)
      .headers({
        Authorization: `Bearer ${account1UserToken.value!.release()}`,
      });
    response.assertOk();

    expect(response.body()).toEqual({
      categories: [],
    });
  });

  test("an array with the categories for the account", async ({
    client,
    expect,
  }) => {
    // The account the user does have access to has no categories
    const account1 = await AccountFactory.with("users", 1)
      .with("categories", 3)
      .create();

    // Create another account which the user does not have access to with categories
    await AccountFactory.with("users", 1).with("categories", 5).create();

    const account1User = await account1.related("users").query().firstOrFail();
    const account1UserToken = await User.accessTokens.create(account1User);
    const response = await client
      .get(`/accounts/${account1.id}/categories`)
      .headers({
        Authorization: `Bearer ${account1UserToken.value!.release()}`,
      });
    response.assertOk();

    const account1Categories = await account1.related("categories").query();
    expect(response.body()).toEqual({
      categories: account1Categories.map((c) => c.toJSON()),
    });
  });
});
