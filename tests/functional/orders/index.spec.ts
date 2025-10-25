import { AccountFactory } from "#database/factories/account_factory";
import { CustomerFactory } from "#database/factories/customer_factory";
import { OrderFactory } from "#database/factories/order_factory";
import { UserFactory } from "#database/factories/user_factory";
import User from "#models/user";
import { test } from "@japa/runner";

test.group("orders/index", () => {
  test("error when not authenticated", async ({ client }) => {
    const account = await AccountFactory.create();

    // Make the request
    const response = await client
      .get(`/accounts/${account.id}/orders`)
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

  test("error when attempting to access orders of a different account", async ({
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
      .get(`/accounts/${account2.id}/orders`)
      .headers({ Authorization: `Bearer ${account1UserTokenString}` });

    response.assertForbidden();
  });

  test("error when attempting to access orders when not an account manager", async ({
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
      .get(`/accounts/${account1.id}/orders`)
      .headers({ Authorization: `Bearer ${account1UserTokenString}` });

    response.assertForbidden();
  });

  test("empty array when there are no orders for the account as a manager", async ({
    client,
    expect,
  }) => {
    // The account the user does have access to has no orders
    const account1 = await AccountFactory.with("users", 1).create();

    // Create another account which the user does not have access to with orders
    await AccountFactory.with("users", 1).with("orders", 5).create();

    const account1User = await account1.related("users").query().firstOrFail();
    const account1UserToken = await User.accessTokens.create(account1User);
    const response = await client
      .get(`/accounts/${account1.id}/orders`)
      .headers({
        Authorization: `Bearer ${account1UserToken.value!.release()}`,
      });
    response.assertOk();

    expect(response.body()).toEqual({
      orders: [],
    });
  });

  test("an array with the orders for the account as a manager", async ({
    client,
    expect,
  }) => {
    // The account the user does have access to has no orders
    const account1 = await AccountFactory.with("users", 1)
      .with("orders", 3)
      .create();

    // Create another account which the user does not have access to with orders
    await AccountFactory.with("users", 1).with("orders", 5).create();

    const account1User = await account1.related("users").query().firstOrFail();
    const account1UserToken = await User.accessTokens.create(account1User);
    const response = await client
      .get(`/accounts/${account1.id}/orders`)
      .headers({
        Authorization: `Bearer ${account1UserToken.value!.release()}`,
      });
    response.assertOk();

    const account1Orders = await account1.related("orders").query();
    expect(response.body()).toEqual({
      orders: account1Orders.map((c) => c.toJSON()),
    });
  });

  test("error when not supplying a customer id to access all orders as a customer", async ({
    client,
  }) => {
    // The account the user does have access to has no orders
    const account1 = await AccountFactory.create();
    const customer1 = await CustomerFactory.merge({
      accountId: account1.id,
    }).create();

    const account1User = await UserFactory.merge({
      accountId: account1.id,
      customerId: customer1.id,
    }).create();
    const account1UserToken = await User.accessTokens.create(account1User);
    const response = await client
      .get(`/accounts/${account1.id}/orders`)
      .headers({
        Authorization: `Bearer ${account1UserToken.value!.release()}`,
      });
    response.assertForbidden();
  });

  test("error when supplying another customer id to access a different customers orders as a customer", async ({
    client,
  }) => {
    // The account the user does have access to has no orders
    const account1 = await AccountFactory.create();
    const customer1 = await CustomerFactory.merge({
      accountId: account1.id,
    }).create();
    const customer2 = await CustomerFactory.merge({
      accountId: account1.id,
    }).create();

    const account1User = await UserFactory.merge({
      accountId: account1.id,
      customerId: customer1.id,
    }).create();
    const account1UserToken = await User.accessTokens.create(account1User);
    const response = await client
      .get(`/accounts/${account1.id}/orders?customerId=${customer2.id}`)
      .headers({
        Authorization: `Bearer ${account1UserToken.value!.release()}`,
      });
    response.assertForbidden();
  });

  test("empty array when there are no orders for the account as a customer", async ({
    client,
    expect,
  }) => {
    // The account the user does have access to has no orders
    const account1 = await AccountFactory.create();
    const customer1 = await CustomerFactory.merge({
      accountId: account1.id,
    }).create();

    const account1User = await UserFactory.merge({
      accountId: account1.id,
      customerId: customer1.id,
    }).create();
    const account1UserToken = await User.accessTokens.create(account1User);
    const response = await client
      .get(`/accounts/${account1.id}/orders?customerId=${customer1.id}`)
      .headers({
        Authorization: `Bearer ${account1UserToken.value!.release()}`,
      });
    response.assertOk();

    expect(response.body()).toEqual({
      orders: [],
    });
  });

  test("array of only the customers orders when there are orders for the account as a customer", async ({
    client,
    expect,
  }) => {
    // The account the user does have access to has no orders
    const account1 = await AccountFactory.create();
    const customer1 = await CustomerFactory.merge({
      accountId: account1.id,
    }).create();
    const customer2 = await CustomerFactory.merge({
      accountId: account1.id,
    }).create();

    const expectedOrders = await OrderFactory.merge({
      accountId: account1.id,
      customerId: customer1.id,
    }).createMany(5);
    await OrderFactory.merge({
      accountId: account1.id,
      customerId: customer2.id,
    }).createMany(5);

    const account1User = await UserFactory.merge({
      accountId: account1.id,
      customerId: customer1.id,
    }).create();
    const account1UserToken = await User.accessTokens.create(account1User);
    const response = await client
      .get(`/accounts/${account1.id}/orders?customerId=${customer1.id}`)
      .headers({
        Authorization: `Bearer ${account1UserToken.value!.release()}`,
      });
    response.assertOk();

    expect(response.body()).toEqual({
      orders: expectedOrders.map((o) => o.toJSON()),
    });
  });

  test("array of only the customers orders when there are orders for the account as a manager", async ({
    client,
    expect,
  }) => {
    // The account the user does have access to has no orders
    const account1 = await AccountFactory.create();
    const customer1 = await CustomerFactory.merge({
      accountId: account1.id,
    }).create();
    const customer2 = await CustomerFactory.merge({
      accountId: account1.id,
    }).create();

    const expectedOrders = await OrderFactory.merge({
      accountId: account1.id,
      customerId: customer1.id,
    }).createMany(5);
    await OrderFactory.merge({
      accountId: account1.id,
      customerId: customer2.id,
    }).createMany(5);

    const account1User = await UserFactory.merge({
      accountId: account1.id,
    }).create();
    const account1UserToken = await User.accessTokens.create(account1User);
    const response = await client
      .get(`/accounts/${account1.id}/orders?customerId=${customer1.id}`)
      .headers({
        Authorization: `Bearer ${account1UserToken.value!.release()}`,
      });
    response.assertOk();

    expect(response.body()).toEqual({
      orders: expectedOrders.map((o) => o.toJSON()),
    });
  });
});
