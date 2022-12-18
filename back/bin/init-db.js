import dbService from '../src/use_cases/database/db-service'
import models from '../src/domain/models'

// sync() will create all table if they don't exist in database
models.sequelize.sync().then(() => {
  dbService.init()
})
