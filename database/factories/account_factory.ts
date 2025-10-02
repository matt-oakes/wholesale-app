import factory from '@adonisjs/lucid/factories'
import Account from '#models/account'
import stringHelpers from '@adonisjs/core/helpers/string'

export const AccountFactory = factory
  .define(Account, async ({ faker }) => {
    const name = faker.company.name()
    return {
      name,
      slug: stringHelpers.camelCase(name).toLowerCase(),
    }
  })
  .build()
