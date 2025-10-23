import User from "#models/user";
import factory from "@adonisjs/lucid/factories";
import { AccountFactory } from "./account_factory.js";
import { CustomerFactory } from "./customer_factory.js";

export const UserFactory = factory
  .define(User, async ({ faker }) => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    return {
      firstName,
      lastName,
      email: faker.internet.email({ firstName, lastName }),
      password: faker.internet.password(),
      customerId: null,
    };
  })
  .relation("account", () => AccountFactory)
  .relation("customer", () => CustomerFactory)
  .build();
