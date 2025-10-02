import type { HttpContext } from "@adonisjs/core/http";

export default class UserController {
  async index({ auth }: HttpContext) {
    const user = await auth.authenticate();
    return { user };
  }
}
