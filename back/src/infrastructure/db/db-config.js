import env from '../env/env'

const dbConfig = () => {
  switch (env('NODE_ENV')) {
    case 'test':
      return {
        dialect: 'sqlite',
        storage: './src/infrastructure/db/data.test.sqlite',
      }
    case 'development':
    default:
      return {
        dialect: 'sqlite',
        storage: './src/infrastructure/db/data.development.sqlite',
      }
  }
}

// Heroku hands us a DATABASE_URL carrying ?sslmode=require, and Sequelize 6
// overwrites dialectOptions with everything it parses out of that URL
// (sequelize/lib/sequelize.js: `Object.assign(options.dialectOptions,
// pgConnectionString.parse(uri))`), so ssl options passed as dialectOptions are
// discarded. Since pg 8.16 a bare `require` means `verify-full`, which rejects
// Heroku's self-signed certificate chain. The ssl settings therefore have to
// live in the URL, where `uselibpqcompat=true` restores the libpq meaning of
// `require`: encrypt, do not verify the chain.
const productionDatabaseUrl = () => {
  const databaseUrl = env('DATABASE_URL')
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required when NODE_ENV is production')
  }
  const url = new URL(databaseUrl)
  url.searchParams.set('sslmode', 'require')
  url.searchParams.set('uselibpqcompat', 'true')
  return url.toString()
}

export {
  dbConfig,
  productionDatabaseUrl,
}
