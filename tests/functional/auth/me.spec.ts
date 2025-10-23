import { AccountFactory } from "#database/factories/account_factory";
import { UserFactory } from "#database/factories/user_factory";
import User from "#models/user";
import { test } from "@japa/runner";

test.group("auth/me", () => {
  test("error if no authenticated token passed in", async ({ client }) => {
    // Make the request
    const response = await client.get("/auth/me").headers({});

    // Should be denied
    response.assertUnauthorized();
  });

  test("error if invalid authentication token passed in", async ({
    client,
  }) => {
    // Make the request
    const response = await client.get("/auth/me").headers({
      Authorization: "Bearer invalid-token",
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
    const response = await client.get("/auth/me").headers({
      Authorization: `Bearer ${tokenString}`,
    });

    // Should be successful
    response.assertOk();

    // Ensure the body has the correct shape
    const body = response.body();
    expect(body).toMatchObject({
      user: user.toJSON(),
    });
  });
});
