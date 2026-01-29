import { Decimal } from 'decimal.js'
import store from 'store2'
import SuperJSON from 'superjson'

function createStorage() {
  SuperJSON.registerCustom<Decimal, string>(
    {
      deserialize: (v) => new Decimal(v),
      isApplicable: (v): v is Decimal => Decimal.isDecimal(v),
      serialize: (v) => v.toJSON(),
    },
    'decimal.js',
  )

  store._.revive = (_, v) => {
    return SuperJSON.parse(v)
  }
  store._.replace = (_, v) => {
    return SuperJSON.stringify(v)
  }

  return store.namespace('app')
}

export const storage = createStorage()
