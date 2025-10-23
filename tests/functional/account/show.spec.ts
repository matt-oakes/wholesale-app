import { AccountFactory } from "#database/factories/account_factory";
import { UserFactory } from "#database/factories/user_factory";
import User from "#models/user";
import { test } from "@japa/runner";

test.group("accounts/show", () => {
  test("error if no authenticated token passed in", async ({ client }) => {
    const account = await AccountFactory.create();

    // Make the request
    const response = await client.get(`/accounts/${account.id}`).headers({});

    // Should be denied
    response.assertUnauthorized();
  });

  test("error if invalid authentication token passed in", async ({
    client,
  }) => {
    const account = await AccountFactory.create();

    // Make the request
    const response = await client.get(`/accounts/${account.id}`).headers({
      Authorization: "Bearer invalid-token",
    });

    // Should be denied
    response.assertUnauthorized();
  });

  test("error if the user is not part of the given account", async ({
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
    const response = await client.get(`/accounts/${account2.id}`).headers({
      Authorization: `Bearer ${account1UserTokenString}`,
    });

    // Should be denied
    response.assertUnauthorized();
  });

  test("success if valid token provided", async ({ client, expect }) => {
    const account = await AccountFactory.create();
    const user = await UserFactory.merge({ accountId: account.id }).create();
    const token = await User.accessTokens.create(user);
    const tokenString = token.value!.release();

    // Make the request
    const response = await client.get(`/accounts/${account.id}`).headers({
      Authorization: `Bearer ${tokenString}`,
    });

    // Should be allowed
    response.assertOk();

    // Ensure the shape is correct
    expect(response.body()).toMatchObject({
      account: account.toJSON(),
    });
  });
});
