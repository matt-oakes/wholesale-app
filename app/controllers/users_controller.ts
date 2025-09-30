import type { HttpContext } from '@adonisjs/core/http'

export default class UserController {
  index({ auth }: HttpContext) {
    const user = auth.getUserOrFail()
    return { user }
  }
}
