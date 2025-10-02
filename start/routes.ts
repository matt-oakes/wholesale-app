/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

const AuthController = () => import('#controllers/auth_controller')
const AccountController = () => import('#controllers/account_controller')
const UserController = () => import('#controllers/users_controller')

/**
 * Auth routes used to create accounts, login, and logout
 */
router
  .group(() => {
    router.post('register', [AuthController, 'register'])
    router.post('login', [AuthController, 'login'])
    router.post('logout', [AuthController, 'logout'])
  })
  .prefix('auth')

/**
 * Account routes
 */
router.get('account', [AccountController, 'index'])

/**
 * User routes
 */
router.get('user', [UserController, 'index'])
