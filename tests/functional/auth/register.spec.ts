import Account from '#models/account'
import User from '#models/user'
import { test } from '@japa/runner'

test.group('auth/register', () => {
  test('error when not passing required value', async ({ client }) => {
    const response = await client.post('/auth/register').json({
      firstName: 'Matt',
      lastName: 'Oakes',
      email: 'hello@mattoakes.net',
      password: 'password123',
      // accountName is missing
    })
    response.assertUnprocessableEntity()
  })

  test('success and data creation when not passing in correct values', async ({
    client,
    expect,
  }) => {
    // Make the request
    const response = await client.post('/auth/register').json({
      firstName: 'Matt',
      lastName: 'Oakes',
      email: 'hello@mattoakes.net',
      password: 'password123',
      accountName: 'Example Store',
    })
    response.assertOk()

    // Ensure the body has the correct shape
    const body = response.body()
    expect(body).toMatchObject({
      token: expect.any(String),
      user: expect.objectContaining({
        id: expect.any(Number),
        firstName: 'Matt',
        lastName: 'Oakes',
        email: 'hello@mattoakes.net',
      }),
      account: expect.objectContaining({
        id: expect.any(Number),
        name: 'Example Store',
      }),
    })

    // Ensure the account exists
    const account = await Account.find(body.account.id)
    expect(account?.toJSON()).toMatchObject({
      id: body.account.id,
      name: 'Example Store',
    })

    // Ensure the user exists
    const user = await User.findBy({
      email: 'hello@mattoakes.net',
      accountId: body.account.id,
    })
    expect(user?.toJSON()).toMatchObject({
      id: body.user.id,
      firstName: 'Matt',
      lastName: 'Oakes',
      email: 'hello@mattoakes.net',
    })
  })
})
