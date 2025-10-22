import { AccountFactory } from "#database/factories/account_factory";
import { CustomerFactory } from "#database/factories/customer_factory";
import { OrderFactory } from "#database/factories/order_factory";
import { UserFactory } from "#database/factories/user_factory";
import User from "#models/user";
import { test } from "@japa/runner";

test.group("orders", () => {
  test("error when not authenticated", async ({ client }) => {
    const response = await client.get("/orders");
    response.assertUnauthorized();
  });

  test("error when passing invalid auth token", async ({ client }) => {
    const response = await client.get("/orders").headers({
      Authorization: "Bearer invalid-token",
    });
    response.assertUnauthorized();
  });

  test("empty array when there are no orders for the manager user", async ({
    client,
    expect,
  }) => {
    // The account the user does have access to has no orders
    const account1 = await AccountFactory.with("users", 1).create();
    const account1User = await UserFactory.merge({
      accountId: account1.id,
    }).create();

    // Create another account which the user does not have access to with orders
    await AccountFactory.with("users", 1).with("orders", 5).create();

    const account1UserToken = await User.accessTokens.create(account1User);
    const response = await client.get("/orders").headers({
      Authorization: `Bearer ${account1UserToken.value!.release()}`,
    });
    response.assertOk();

    expect(response.body()).toEqual({
      orders: [],
    });
  });

  test("an array with the orders for the manager user", async ({
    client,
    expect,
  }) => {
    // The account the user does have access to has orders
    const account1 = await AccountFactory.with("orders", 3).create();
    const account1ManagerUser = await UserFactory.merge({
      accountId: account1.id,
    }).create();

    // Create another account which the user does not have access to with orders
    await AccountFactory.with("users", 1).with("orders", 5).create();

    const account1ManagerUserToken =
      await User.accessTokens.create(account1ManagerUser);
    const response = await client.get("/orders").headers({
      Authorization: `Bearer ${account1ManagerUserToken.value!.release()}`,
    });
    response.assertOk();

    const account1Orders = await account1
      .related("orders")
      .query()
      .preload("lineItems");
    expect(response.body()).toEqual({
      orders: account1Orders.map((c) => c.toJSON()),
    });
  });

  test("empty array when there are no orders for the customer user", async ({
    client,
    expect,
  }) => {
    // The account the user does have access to has no orders
    const account1 = await AccountFactory.with("users", 1)
      .with("orders", 2) // Orders not related to any customer
      .create();
    const customer1 = await CustomerFactory.merge({
      accountId: account1.id,
    }).create();
    const account1User = await UserFactory.merge({
      accountId: account1.id,
      customerId: customer1.id,
    }).create();

    // Orders for another customer
    const customer2 = await CustomerFactory.merge({
      accountId: account1.id,
    }).create();
    await OrderFactory.merge({
      accountId: account1.id,
      customerId: customer2.id,
    }).createMany(2);

    // Create another account which the user does not have access to with orders
    await AccountFactory.with("users", 1).with("orders", 5).create();

    const account1UserToken = await User.accessTokens.create(account1User);
    const response = await client.get("/orders").headers({
      Authorization: `Bearer ${account1UserToken.value!.release()}`,
    });
    response.assertOk();

    expect(response.body()).toEqual({
      orders: [],
    });
  });

  test("an array with the orders for the customer user", async ({
    client,
    expect,
  }) => {
    // The account the user does have access to has orders
    const account1 = await AccountFactory.with("users", 1)
      .with("orders", 2) // Orders not related to any customer
      .create();
    const customer1 = await CustomerFactory.merge({
      accountId: account1.id,
    }).create();
    await OrderFactory.merge({
      accountId: account1.id,
      customerId: customer1.id,
    }).createMany(4);
    const account1User = await UserFactory.merge({
      accountId: account1.id,
      customerId: customer1.id,
    }).create();
    // Orders for another customer
    const customer2 = await CustomerFactory.merge({
      accountId: account1.id,
    }).create();
    await OrderFactory.merge({
      accountId: account1.id,
      customerId: customer2.id,
    }).createMany(2);

    // Create another account which the user does not have access to with orders
    await AccountFactory.with("users", 1).with("orders", 5).create();

    const account1UserToken = await User.accessTokens.create(account1User);
    const response = await client.get("/orders").headers({
      Authorization: `Bearer ${account1UserToken.value!.release()}`,
    });
    response.assertOk();

    const account1Customer1Orders = await account1
      .related("orders")
      .query()
      .where("customerId", customer1.id)
      .preload("lineItems");
    expect(response.body()).toEqual({
      orders: account1Customer1Orders.map((c) => c.toJSON()),
    });
  });
});
