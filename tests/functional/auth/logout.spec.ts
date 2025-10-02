import { AccountFactory } from '#database/factories/account_factory'
import { UserFactory } from '#database/factories/user_factory'
import User from '#models/user'
import { test } from '@japa/runner'

test.group('auth/logout', () => {
  test('error if no authenticated token passed in', async ({ client }) => {
    // Make the request
    const response = await client.post('/auth/logout').headers({})

    // Should be denied
    response.assertUnauthorized()
  })

  test('error if invalid authentication token passed in', async ({ client }) => {
    // Make the request
    const response = await client.post('/auth/logout').headers({
      Authorization: 'Bearer invalid-token',
    })

    // Should be denied
    response.assertUnauthorized()
  })

  test('success if valid token provided', async ({ client, expect }) => {
    const account = await AccountFactory.create()
    const user = await UserFactory.merge({ accountId: account.id }).create()
    const token = await User.accessTokens.create(user)
    const tokenString = token.value!.release()

    // Make the request
    const response = await client.post('/auth/logout').headers({
      Authorization: `Bearer ${tokenString}`,
    })

    // Should be successful
    response.assertOk()

    // Token should be deleted
    const accessTokens = await User.accessTokens.all(user)
    expect(accessTokens).toHaveLength(0)
  })
})
