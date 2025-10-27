import { AccountFactory } from "#database/factories/account_factory";
import { CustomerFactory } from "#database/factories/customer_factory";
import { UserFactory } from "#database/factories/user_factory";
import User from "#models/user";
import { test } from "@japa/runner";

test.group("customers/index", () => {
  test("error when not authenticated", async ({ client }) => {
    const account = await AccountFactory.create();

    // Make the request
    const response = await client
      .get(`/accounts/${account.id}/customers`)
      .headers({});

    response.assertUnauthorized();
  });

  test("error when passing invalid auth token", async ({ client }) => {
    const account = await AccountFactory.create();

    // Make the request
    const response = await client
      .get(`/accounts/${account.id}/customers`)
      .headers({ Authorization: "Bearer invalid-token" });

    response.assertUnauthorized();
  });

  test("error when attempting to access customers of a different account", async ({
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
      .get(`/accounts/${account2.id}/customers`)
      .headers({ Authorization: `Bearer ${account1UserTokenString}` });

    response.assertForbidden();
  });

  test("error when attempting to access customers when not an account manager", async ({
    client,
  }) => {
    const account1 = await AccountFactory.merge({
      name: "Account 1",
      slug: "account1",
    }).create();

    const customer1 = await CustomerFactory.merge({
      name: "Customer 1",
      accountId: account1.id,
    }).create();

    const account1User = await UserFactory.merge({
      accountId: account1.id,
      customerId: customer1.id,
    }).create();
    const account1UserToken = await User.accessTokens.create(account1User);
    const account1UserTokenString = account1UserToken.value!.release();

    // Make the request
    const response = await client
      .get(`/accounts/${account1.id}/customers`)
      .headers({ Authorization: `Bearer ${account1UserTokenString}` });

    response.assertForbidden();
  });

  test("empty array when there are no customers for the account as a manager", async ({
    client,
    expect,
  }) => {
    // The account the user does have access to has no customers
    const account1 = await AccountFactory.with("users", 1).create();

    // Create another account which the user does not have access to with customers
    await AccountFactory.with("users", 1).with("customers", 5).create();

    const account1User = await account1.related("users").query().firstOrFail();
    const account1UserToken = await User.accessTokens.create(account1User);
    const response = await client
      .get(`/accounts/${account1.id}/customers`)
      .headers({
        Authorization: `Bearer ${account1UserToken.value!.release()}`,
      });
    response.assertOk();

    expect(response.body()).toEqual({
      customers: [],
    });
  });

  test("an array with the customers for the account as a manager", async ({
    client,
    expect,
  }) => {
    // The account the user does have access to has no customers
    const account1 = await AccountFactory.with("users", 1)
      .with("customers", 3)
      .create();

    // Create another account which the user does not have access to with customers
    await AccountFactory.with("users", 1).with("customers", 5).create();

    const account1User = await account1.related("users").query().firstOrFail();
    const account1UserToken = await User.accessTokens.create(account1User);
    const response = await client
      .get(`/accounts/${account1.id}/customers`)
      .headers({
        Authorization: `Bearer ${account1UserToken.value!.release()}`,
      });
    response.assertOk();

    const account1Customers = await account1.related("customers").query();
    expect(response.body()).toEqual({
      customers: account1Customers.map((c) => c.toJSON()),
    });
  });
});
