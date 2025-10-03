/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from "@adonisjs/core/services/router";
import { middleware } from "./kernel.js";

const AuthController = () => import("#controllers/auth_controller");
const AccountController = () => import("#controllers/account_controller");
const CategoriesController = () => import("#controllers/categories_controller");
const ProductsController = () => import("#controllers/products_controller");
const UserController = () => import("#controllers/users_controller");

/**
 * Auth routes used to create accounts, login, and logout
 */
router
  .group(() => {
    router.post("register", [AuthController, "register"]);
    router.post("login", [AuthController, "login"]);
    router.post("logout", [AuthController, "logout"]);
  })
  .prefix("auth");

/**
 * Account routes
 */
router.get("account", [AccountController, "index"]);

/**
 * Categories routes
 */
router
  .group(() => {
    router.get("", [CategoriesController, "index"]);
    router.get("/:categoryId", [CategoriesController, "show"]);
  })
  .prefix("categories")
  .use(middleware.auth());

/**
 * Products routes
 */
router
  .group(() => {
    router.get("", [ProductsController, "index"]);
    router.get("/:productId", [ProductsController, "show"]);
  })
  .prefix("products")
  .use(middleware.auth());

/**
 * User routes
 */
router.get("user", [UserController, "index"]);
