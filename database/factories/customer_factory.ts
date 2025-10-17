import Customer from "#models/customer";
import factory from "@adonisjs/lucid/factories";

export const CustomerFactory = factory
  .define(Customer, async ({ faker }) => {
    const name = faker.company.name();
    return {
      name,
      billingEmail: faker.internet.email({ firstName: name }),
    };
  })
  .build();
