import fs from 'fs'
import path from 'path'
import Sequelize from 'sequelize'
import { dbConfig } from '../../infrastructure/db/db-config'
import env from '../../infrastructure/env/env'
import { isProduction } from '../../infrastructure/env/process'

const config = dbConfig()

let sequelize
if (isProduction()) {
  sequelize = new Sequelize(env('DATABASE_URL'), { dialect: 'postgres', dialectOptions: { ssl: { require: true, rejectUnauthorized: false } } })
} else {
  sequelize = new Sequelize(env('DATABASE_NAME'), config.username, config.password, config)
}

const basename = path.basename(__filename)
const db = {}
fs
  .readdirSync(__dirname)
  .filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach(file => {
    const model = sequelize.import(path.join(__dirname, file))
    db[model.name] = model
  })

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db

// todo : à déplacer dans infra
