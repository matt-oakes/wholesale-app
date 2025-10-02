import Account from '#models/account'
import User from '#models/user'
import { authLoginValidator, authRegisterValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'
import db from '@adonisjs/lucid/services/db'

export default class AuthController {
  /**
   * Create a new account and the initial owner user
   */
  async register({ auth, request }: HttpContext) {
    // Validate and get the payload
    const { accountSlug, accountName, firstName, lastName, email, password } =
      await request.validateUsing(authRegisterValidator)

    // With a transaction create the account and owner user
    const newData = await db.transaction(async (transaction) => {
      // Create an account
      const account = await Account.create(
        { slug: accountSlug, name: accountName },
        { client: transaction }
      )

      // Create a user as the account owner
      const user = await account
        .related('users')
        .create(
          { firstName, lastName, email, password, accountRole: 'owner' },
          { client: transaction }
        )

      return { account, user }
    })
    const { account, user } = newData

    // Create a new token for a user
    const token = await auth.use('api').createToken(user)

    // Return the data
    return { account, user, token: token.value!.release() }
  }

  /**
   * Login with an existing user
   */
  async login({ request, response }: HttpContext) {
    const { email, password, accountSlug } = await request.validateUsing(authLoginValidator)

    // Get the account
    const account = await Account.findBy({ slug: accountSlug })
    if (!account) {
      return response.abort('Invalid credentials')
    }

    // TODO: This code is prone to timing attacks where it can be used to discover if a user with a given email exists.
    // This should be replaced with the `User.verifyCredentials` method, however, this currently does not work with
    // our scheme which email and accountId combinations are unique rather than just emails.
    const user = await User.findBy({ email, accountId: account.id })
    if (!user) {
      return response.abort('Invalid credentials')
    }
    const isPasswordValid = await hash.verify(user.password, password)
    if (!isPasswordValid) {
      return response.abort('Invalid credentials')
    }

    // Create a new token
    const token = await User.accessTokens.create(user)

    // Return the data
    return { account, user, token: token.value!.release() }
  }

  /**
   * Logout with the current user token
   */
  async logout({ auth, response }: HttpContext) {
    await auth.authenticate()
    await auth.use('api').invalidateToken()
    return response.ok('Logged out')
  }
}
