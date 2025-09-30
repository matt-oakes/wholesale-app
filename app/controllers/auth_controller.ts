import Account from '#models/account'
import User from '#models/user'
import { authLoginValidator, authRegisterValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class AuthController {
  /**
   * Create a new account and the initial owner user
   */
  async register({ auth, request }: HttpContext) {
    // Validate and get the payload
    const { accountName, firstName, lastName, email, password } =
      await request.validateUsing(authRegisterValidator)

    // With a transaction create the account and owner user
    const user = await db.transaction(async (transaction) => {
      // Create an account
      const account = await Account.create({ name: accountName }, { client: transaction })

      // Create a user as the account owner
      return account
        .related('users')
        .create(
          { firstName, lastName, email, password, accountRole: 'owner' },
          { client: transaction }
        )
    })

    // Create and return a new token for a user
    const token = await auth.use('api').createToken(user)
    return { type: 'bearer', value: token.value!.release() }
  }

  /**
   * Login with an existing user
   */
  async login({ request }: HttpContext) {
    const { email, password } = await request.validateUsing(authLoginValidator)
    const user = await User.verifyCredentials(email, password)
    const token = await User.accessTokens.create(user)
    return { type: 'bearer', value: token.value!.release() }
  }

  /**
   * Logout with the current user token
   */
  async logout({ auth, response }: HttpContext) {
    await auth.use('api').invalidateToken()
    return response.ok('Logged out')
  }
}
