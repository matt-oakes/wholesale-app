import Account from '#models/account'
import { HttpContext } from '@adonisjs/core/http'

export default class AccountController {
  async index({ auth }: HttpContext) {
    const user = await auth.authenticate()
    const account = await Account.findOrFail(user.accountId)
    return { account }
  }
}
