import { AccountFactory } from "#database/factories/account_factory";
import { CustomerFactory } from "#database/factories/customer_factory";
import { OrderFactory } from "#database/factories/order_factory";
import { UserFactory } from "#database/factories/user_factory";
import User from "#models/user";
import { test } from "@japa/runner";

test.group("orders/show", () => {
  test("error when not authenticated", async ({ client }) => {
    const order = await OrderFactory.with("account").create();
    const { account } = order;

    // Make the request
    const response = await client
      .get(`/accounts/${account.id}/orders/${order.id}`)
      .headers({});

    response.assertUnauthorized();
  });

  test("error when passing invalid auth token", async ({ client }) => {
    const account = await AccountFactory.create();

    // Make the request
    const response = await client
      .get(`/accounts/${account.id}/orders`)
      .headers({ Authorization: "Bearer invalid-token" });

    response.assertUnauthorized();
  });

  test("error when attempting to access a order of a different account as a manager", async ({
    client,
  }) => {
    const order1 = await OrderFactory.with("account").create();
    const { account: account1 } = order1;
    const order2 = await OrderFactory.with("account").create();
    const { account: account2 } = order2;

    const account1User = await UserFactory.merge({
      accountId: account1.id,
    }).create();
    const account1UserToken = await User.accessTokens.create(account1User);
    const account1UserTokenString = account1UserToken.value!.release();

    // Make the request
    const response = await client
      .get(`/accounts/${account2.id}/orders/${order2.id}`)
      .headers({ Authorization: `Bearer ${account1UserTokenString}` });

    response.assertForbidden();
  });

  test("error when the requested order id doesn't exist on the given account as a manager", async ({
    client,
  }) => {
    const order1 = await OrderFactory.with("account", 1, (account) =>
      account.with("users"),
    ).create();
    const { account: account1 } = order1;

    const order2 = await OrderFactory.with("account").create();

    const account1User = await account1.related("users").query().firstOrFail();
    const account1UserToken = await User.accessTokens.create(account1User);
    const response = await client
      .get(`/accounts/${account1.id}/orders/${order2.id}`)
      .headers({
        Authorization: `Bearer ${account1UserToken.value!.release()}`,
      });
    response.assertNotFound();
  });

  test("not found error when the requested order id doesn't exist as a manager", async ({
    client,
  }) => {
    const order1 = await OrderFactory.with("account", 1, (account) =>
      account.with("users", 1),
    ).create();
    const { account: account1 } = order1;

    const account1User = await account1.related("users").query().firstOrFail();
    const account1UserToken = await User.accessTokens.create(account1User);
    const response = await client
      .get(`/accounts/${account1.id}/orders/cat_invalid`)
      .headers({
        Authorization: `Bearer ${account1UserToken.value!.release()}`,
      });
    response.assertNotFound();
  });

  test("returns the order when it exists on the account as a manager", async ({
    client,
    expect,
  }) => {
    const account1 = await AccountFactory.with("users", 1).create();
    const order1 = await OrderFactory.merge({
      accountId: account1.id,
      customerId: null,
    }).create();

    const account1User = await account1.related("users").query().firstOrFail();
    const account1UserToken = await User.accessTokens.create(account1User);
    const response = await client
      .get(`/accounts/${account1.id}/orders/${order1.id}`)
      .headers({
        Authorization: `Bearer ${account1UserToken.value!.release()}`,
      });
    response.assertOk();

    expect(response.body()).toEqual({ order: order1.toJSON() });
  });

  test("returns the order when it exists on the account as a customer", async ({
    client,
    expect,
  }) => {
    const account1 = await AccountFactory.create();
    const customer1 = await CustomerFactory.merge({
      accountId: account1.id,
    }).create();
    const order1 = await OrderFactory.merge({
      accountId: account1.id,
      customerId: customer1.id,
    }).create();

    const account1User = await UserFactory.merge({
      accountId: account1.id,
      customerId: customer1.id,
    }).create();
    const account1UserToken = await User.accessTokens.create(account1User);
    const response = await client
      .get(`/accounts/${account1.id}/orders/${order1.id}`)
      .headers({
        Authorization: `Bearer ${account1UserToken.value!.release()}`,
      });
    response.assertOk();

    expect(response.body()).toEqual({ order: order1.toJSON() });
  });

  test("returns an error order when attempting to access a different customers order as a customer", async ({
    client,
  }) => {
    const account1 = await AccountFactory.create();
    const customer1 = await CustomerFactory.merge({
      accountId: account1.id,
    }).create();
    const customer2 = await CustomerFactory.merge({
      accountId: account1.id,
    }).create();
    const order1 = await OrderFactory.merge({
      accountId: account1.id,
      customerId: customer2.id,
    }).create();

    const account1User = await UserFactory.merge({
      accountId: account1.id,
      customerId: customer1.id,
    }).create();
    const account1UserToken = await User.accessTokens.create(account1User);
    const response = await client
      .get(`/accounts/${account1.id}/orders/${order1.id}`)
      .headers({
        Authorization: `Bearer ${account1UserToken.value!.release()}`,
      });
    response.assertNotFound();
  });
});
