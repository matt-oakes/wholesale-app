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
const AccountsController = () => import("#controllers/accounts_controller");
const CategoriesController = () => import("#controllers/categories_controller");
const CustomersController = () => import("#controllers/customers_controller");
const OrdersController = () => import("#controllers/orders_controller");
const ProductsController = () => import("#controllers/products_controller");

/**
 * Auth routes used to create accounts, login, and logout
 */
router
  .group(() => {
    router.post("register", [AuthController, "register"]);
    router.post("login", [AuthController, "login"]);
    router.post("logout", [AuthController, "logout"]);
    router.get("me", [AuthController, "me"]);
  })
  .prefix("auth");

/**
 * Account-specific routes
 */
router
  .group(() => {
    // Account routes
    router.get("", [AccountsController, "show"]);

    // Categories routes
    router
      .group(() => {
        router.get("", [CategoriesController, "index"]);
        router.get("/:categoryId", [CategoriesController, "show"]);
      })
      .prefix("categories");

    // Customers routes
    router
      .group(() => {
        router.get("", [CustomersController, "index"]);
        router.get("/:customerId", [CustomersController, "show"]);
      })
      .prefix("customers");

    // Orders routes
    router
      .group(() => {
        router.get("", [OrdersController, "index"]);
        router.get("/:orderId", [OrdersController, "show"]);
      })
      .prefix("orders");

    // Products
    router
      .group(() => {
        router.get("", [ProductsController, "index"]);
        router.get("/:productId", [ProductsController, "show"]);
      })
      .prefix("products");
  })
  .prefix("accounts/:accountId")
  .use(middleware.auth())
  .use(middleware.accountAccess());
