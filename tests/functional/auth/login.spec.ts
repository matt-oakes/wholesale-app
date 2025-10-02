import { AccountFactory } from '#database/factories/account_factory'
import { UserFactory } from '#database/factories/user_factory'
import { test } from '@japa/runner'

test.group('auth/login', () => {
  test('error when not passing required value', async ({ client }) => {
    const response = await client.post('/auth/login').json({
      email: 'hello@mattoakes.net',
      password: 'password123',
      // accountSlug is missing
    })
    response.assertUnprocessableEntity()
  })

  test('error when the account does not exist', async ({ client }) => {
    // Make the request
    const response = await client.post('/auth/login').json({
      email: 'hello@mattoakes.net',
      password: 'password123',
      accountSlug: 'invalid',
    })
    response.assertBadRequest()
  })

  test('error when the user does not exist', async ({ client }) => {
    const account = await AccountFactory.create()

    // Make the request
    const response = await client.post('/auth/login').json({
      email: 'hello@mattoakes.net',
      password: 'password123',
      accountSlug: account.slug,
    })
    response.assertBadRequest()
  })

  test('error when the user exists but the password is incorrect', async ({ client }) => {
    const account = await AccountFactory.create()
    const user = await UserFactory.merge({
      accountId: account.id,
      password: 'password123',
    }).create()

    // Make the request
    const response = await client.post('/auth/login').json({
      email: user.email,
      password: 'invalidpassword',
      accountSlug: account.slug,
    })
    response.assertBadRequest()
  })

  test('error when the user exists, but for a different account', async ({ client }) => {
    const accounts = await AccountFactory.createMany(2)
    const user = await UserFactory.merge({
      accountId: accounts[1].id,
      password: 'password123',
    }).create()

    // Make the request
    const response = await client.post('/auth/login').json({
      email: user.email,
      password: 'password123',
      accountSlug: accounts[0].slug,
    })
    response.assertBadRequest()
  })

  test('success when the user exists for the given account', async ({ client, expect }) => {
    const account = await AccountFactory.create()
    const user = await UserFactory.merge({
      accountId: account.id,
      password: 'password123',
    }).create()

    // Make the request
    const response = await client.post('/auth/login').json({
      email: user.email,
      password: 'password123',
      accountSlug: account.slug,
    })
    response.assertOk()

    // Ensure the body has the correct shape
    const body = response.body()
    expect(body).toMatchObject({
      token: expect.any(String),
      user: user.toJSON(),
      account: account.toJSON(),
    })
  })
})
