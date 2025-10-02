import factory from '@adonisjs/lucid/factories'
import Account from '#models/account'

export const AccountFactory = factory
  .define(Account, async ({ faker }) => {
    return {
      name: faker.company.name(),
    }
  })
  .build()
