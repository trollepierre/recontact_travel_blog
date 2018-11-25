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

export {
  dbConfig,
}
